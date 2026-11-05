import { useState } from 'react'
import type { Assessment, ModelOutputType } from '../../schemas'
import { downloadReport } from '../../lib/report'
import { paths } from '../../lib/route'
import { Button } from '../ui/Button'
import { ChevronRightIcon, DownloadIcon, HomeIcon, InfoIcon } from '../icons'
import { cn } from '../../lib/cn'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-2xs md:text-xs">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-ink-strong">
        <li className="flex items-center">
          <a href="#/" aria-label="Home" className="inline-flex items-center gap-1 hover:text-coral">
            <HomeIcon size={13} />
            <span>Home</span>
          </a>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRightIcon size={11} className="text-slate" />
            {item.href && i < items.length - 1 ? (
              <a href={item.href} className="hover:text-coral">
                {item.label}
              </a>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

const outputLabel: Record<ModelOutputType, string> = { image: 'Image', text: 'Text', audio: 'Audio', video: 'Video' }

export function PageHeader({
  title,
  outputType,
  onDownload,
  downloading = false,
  className,
}: {
  title: string
  outputType: ModelOutputType
  onDownload: () => void
  downloading?: boolean
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3', className)}>
      <h1 className="text-xl font-normal leading-tight text-ink-strong sm:text-title">{title}</h1>
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-8 items-center gap-2 rounded-full border border-hairline bg-surface px-4 text-sm font-normal text-ink"
          title="Model output type"
        >
          {outputLabel[outputType]}
          <InfoIcon size={12} aria-hidden="true" />
          <span className="sr-only">model output type</span>
        </span>
        <Button onClick={onDownload} disabled={downloading} aria-busy={downloading} className="disabled:opacity-60">
          <DownloadIcon size={13} />
          {downloading ? 'Preparing PDF…' : 'Download Report'}
        </Button>
      </div>
    </div>
  )
}

/** Breadcrumbs + title + actions shared by every assessment screen; `trail` is whatever follows the product name. */
export function AssessmentHeading({ assessment, trail = [] }: { assessment: Assessment; trail?: Crumb[] }) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const overviewHref = paths.overview(assessment.id)

  async function handleDownload() {
    if (downloading) return

    setDownloading(true)
    setDownloadError('')
    try {
      await downloadReport(assessment)
    } catch (error) {
      console.error('Assessment PDF export failed', error)
      setDownloadError('The assessment PDF could not be created. Please try again.')
    } finally {
      setDownloading(false)
    }
  }
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Assessments', href: '#/' },
          { label: assessment.productName, href: trail.length ? overviewHref : undefined },
          ...trail,
        ]}
      />
      <PageHeader
        title={`Assessment Overview - ${assessment.productName}`}
        outputType={assessment.modelOutputType}
        onDownload={() => void handleDownload()}
        downloading={downloading}
      />
      {downloadError && (
        <p role="alert" className="mb-4 text-sm text-brand-link">
          {downloadError}
        </p>
      )}
    </>
  )
}
