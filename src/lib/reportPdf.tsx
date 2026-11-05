import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { FindingsList } from '../components/overview/FindingsList'
import { RecommendationsTable } from '../components/overview/FindingsDialog'
import { OverviewPanels } from '../components/overview/OverviewPanels'
import { SamplesTable } from '../components/overview/SamplesTable'
import { AssessedInputs } from '../components/sample/AssessedInputs'
import { CategoryResults } from '../components/sample/CategoryResults'
import { InputComparison } from '../components/sample/InputComparison'
import { SampleSummary } from '../components/sample/SampleSummary'
import {
  getAssessedInputs,
  getCategory,
  getReferenceInput,
  getSamplesFor,
  getSampleCategorySummaries,
} from '../data/repository'
import type { Assessment } from '../schemas'
import { AboutReport, ReportCover } from './reportFrontMatter'

const captureWidth = 1440
const margin = 12
const bodyTop = 31
const bodyBottom = 192
const burgundy = '#9e1414'
const ink = '#17171c'
const muted = '#566172'

function loadSamples(assessment: Assessment) {
  const samples = getSamplesFor(assessment)
  if (samples.length !== assessment.sampleIds.length) {
    throw new Error(`Missing sample records for assessment ${assessment.id}`)
  }
  return samples.map((sample) => {
    const reference = getReferenceInput(sample.id)
    if (!reference) throw new Error(`Missing reference input for sample ${sample.id}`)

    const inputs = getAssessedInputs(sample.id)
    return {
      sample,
      reference,
      inputCount: inputs.length,
      categorySummaries: getSampleCategorySummaries(sample.id),
      primaryInputs: inputs.filter((input) => input.categoryId === sample.primaryCategoryId),
    }
  })
}

async function captureBlock(host: HTMLDivElement, root: ReturnType<typeof createRoot>, content: ReactNode) {
  flushSync(() => {
    root.render(<div className="bg-canvas p-2">{content}</div>)
  })

  const block = host.firstElementChild as HTMLElement
  const images = Array.from(block.querySelectorAll('img'))
  for (const image of images) image.loading = 'eager'

  // Force layout so fonts used only in the export are included in fonts.ready.
  block.getBoundingClientRect()
  await Promise.all([document.fonts.ready, ...images.map((image) => image.decode())])

  let resourceError: Error | undefined
  const canvas = await html2canvas(block, {
    backgroundColor: '#ffffff',
    windowWidth: captureWidth + 32,
    windowHeight: 1100,
    scrollX: 0,
    scrollY: 0,
    scale: 1.75,
    useCORS: true,
    logging: false,
    onError: (error) => {
      resourceError ??= error
    },
    ignoreElements: (element) => element.parentElement === document.body && element !== host,
    onclone: async (_clonedDocument, clonedBlock) => {
      const clonedHost = clonedBlock.parentElement
      if (clonedHost) clonedHost.style.left = '0'
      // The clone has its own viewport and can activate different font weights.
      clonedBlock.getBoundingClientRect()
      await clonedBlock.ownerDocument.fonts.ready
    },
  })
  if (resourceError) {
    canvas.width = 0
    throw resourceError
  }
  return canvas
}

export async function downloadAssessmentPdf(assessment: Assessment): Promise<void> {
  const samples = loadSamples(assessment)
  const host = document.createElement('div')
  host.inert = true
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = `position:fixed;top:0;left:-${captureWidth + 32}px;width:${captureWidth}px;pointer-events:none`
  document.body.append(host)
  const root = createRoot(host)

  try {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
    pdf.setProperties({
      title: `SecureAI Assessment Report - ${assessment.productName}`,
      subject: 'Prepared for ST Engineering',
      author: 'Assessment Dashboard',
    })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const bodyWidth = pageWidth - margin * 2
    const bodyHeight = bodyBottom - bodyTop

    let section = ''
    let nextY = bodyTop

    function startPage(title: string, continued = false) {
      if (section) pdf.addPage()
      section = title
      nextY = bodyTop

      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(burgundy)
      pdf.setFontSize(9)
      pdf.text('SecureAI Assessment Report', margin, 12)

      pdf.setTextColor(ink)
      pdf.setFontSize(18)
      pdf.text(continued ? `${title} (continued)` : title, margin, 23)
      pdf.setDrawColor(burgundy)
      pdf.setLineWidth(0.35)
      pdf.line(margin, 26, pageWidth - margin, 26)
    }

    function placeCapture(canvas: HTMLCanvasElement) {
      if (!canvas.width || !canvas.height) throw new Error('An assessment section rendered empty')
      const naturalHeight = (canvas.height / canvas.width) * bodyWidth
      const height = Math.min(naturalHeight, bodyHeight)
      const width = (canvas.width / canvas.height) * height
      if (nextY + height > bodyBottom && nextY > bodyTop) startPage(section, true)

      const left = margin + (bodyWidth - width) / 2
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', left, nextY, width, height)
      nextY += height + 2
    }

    async function addBlock(content: ReactNode) {
      const canvas = await captureBlock(host, root, content)
      try {
        placeCapture(canvas)
      } finally {
        canvas.width = 0
      }
    }

    async function addRows<T>(rows: T[], render: (rows: T[]) => ReactNode) {
      const canvas = await captureBlock(host, root, render(rows))
      try {
        if (rows.length > 1 && canvas.height * bodyWidth > canvas.width * bodyHeight) {
          const middle = Math.ceil(rows.length / 2)
          canvas.width = 0
          await addRows(rows.slice(0, middle), render)
          await addRows(rows.slice(middle), render)
        } else {
          placeCapture(canvas)
        }
      } finally {
        canvas.width = 0
      }
    }

    const generatedOn = new Intl.DateTimeFormat('en-SG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Singapore',
    }).format(new Date())

    section = 'Cover'
    nextY = margin
    await addBlock(<ReportCover assessment={assessment} generatedOn={generatedOn} />)

    startPage('About This Report')
    await addBlock(<AboutReport assessment={assessment} generatedOn={generatedOn} sampleCount={samples.length} />)

    startPage('01 · Assessment Overview')
    const firstSampleRows = samples.slice(0, 3).map(({ sample }) => sample)
    await addBlock(
      <>
        <div className="mb-3 px-1 pt-1">
          <h2 className="text-title font-semibold">{assessment.productName}</h2>
          <p className="mt-1 text-sm text-slate">Assessment ID: {assessment.id}</p>
        </div>
        <OverviewPanels assessment={assessment} />
        <div className="mt-3.5">
          <SamplesTable assessmentId={assessment.id} samples={firstSampleRows} />
        </div>
      </>,
    )
    for (let start = firstSampleRows.length; start < samples.length; start += 5) {
      await addRows(samples.slice(start, start + 5), (rows) => (
        <SamplesTable assessmentId={assessment.id} samples={rows.map(({ sample }) => sample)} />
      ))
    }

    startPage('02 · Summary & Key Findings')
    await addBlock(<p className="px-4 py-3 text-base leading-relaxed text-ink">{assessment.summary}</p>)
    for (let start = 0; start < assessment.findings.length; start += 10) {
      await addRows(assessment.findings.slice(start, start + 10), (findings) => (
        <FindingsList findings={findings} className="px-4 py-3" itemClassName="text-md text-body" />
      ))
    }
    for (let start = 0; start < assessment.recommendations.length; start += 8) {
      await addRows(assessment.recommendations.slice(start, start + 8), (recommendations) => (
        <div className="px-4 py-3">
          <RecommendationsTable recommendations={recommendations} />
        </div>
      ))
    }

    for (const [
      index,
      { sample, reference, inputCount, categorySummaries, primaryInputs },
    ] of samples.entries()) {
      startPage(`03 · Test Sample Details · Sample ${index + 1} of ${samples.length}`)
    
      const selected = primaryInputs[0]
    
      await addBlock(
        <div className="space-y-3.5">
          <SampleSummary sample={sample} totalInputs={inputCount} />
    
          <CategoryResults
            summaries={categorySummaries}
            selected={sample.primaryCategoryId}
          />
    
          <AssessedInputs
            inputs={primaryInputs}
            selectedId={selected?.id}
            categoryLabel={getCategory(sample.primaryCategoryId).label}
          />
    
          <InputComparison
            reference={reference}
            input={selected}
            sampleLabel={sample.label}
            report
          />
        </div>,
      )
    }

    const pageCount = pdf.getNumberOfPages()
    for (let page = 1; page <= pageCount; page++) {
      pdf.setPage(page)
      pdf.setDrawColor('#d9dce1')
      pdf.setLineWidth(0.2)
      pdf.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(muted)
      pdf.text(assessment.id, margin, pageHeight - 8)
      pdf.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
    }

    pdf.save(`${assessment.id}-report.pdf`)
  } finally {
    root.unmount()
    host.remove()
  }
}
