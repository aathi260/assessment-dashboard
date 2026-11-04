import { getCategory, getSamplesFor } from '../data/repository'
import type { Assessment } from '../schemas'
import { formatPp } from './format'

const csv = (cells: (string | number)[]) => cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')

/** Builds a small CSV report for the "Download Report" button. */
export function buildReportCsv(assessment: Assessment): string {
  const score = assessment.overallScore
  const rows: (string | number)[][] = [
    ['Assessment', assessment.productName],
    ['Overall score', score.status === 'scored' ? `${score.value} / ${score.max}` : 'N/A'],
    [],
    ['Confidence metric', 'Value (%)'],
    ...assessment.confidenceMetrics.map((m) => [m.label, m.valuePct]),
    [],
    ['Category', 'Degradation (%)'],
    ...assessment.categoryResults.map((r) => [getCategory(r.categoryId).label, r.degradationPct]),
    [],
    ['Sample', 'Model output (confidence)', 'Result', 'Category'],
    ...getSamplesFor(assessment).map((s) => [
      s.label,
      s.referenceConfidence.toFixed(3),
      formatPp(s.headlineResultPp),
      getCategory(s.primaryCategoryId).label,
    ]),
    [],
    ['Recommendation', 'Priority'],
    ...assessment.recommendations.map((r) => [r.text, r.priority]),
  ]
  return rows.map(csv).join('\r\n')
}

export function downloadReport(assessment: Assessment): void {
  const blob = new Blob([buildReportCsv(assessment)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${assessment.id}-report.csv`
  document.body.append(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
