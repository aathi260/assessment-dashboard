import type { Assessment } from '../../schemas'
import { paths } from '../../app/routes'
import { downloadReport } from '../../lib/report'
import { Breadcrumbs } from './Breadcrumbs'
import type { Crumb } from './Breadcrumbs'
import { PageHeader } from './PageHeader'

/** Breadcrumbs + title + actions shared by every assessment screen; `trail` is whatever follows the product name. */
export function AssessmentHeading({ assessment, trail = [] }: { assessment: Assessment; trail?: Crumb[] }) {
  const overviewHref = paths.overview(assessment.id)
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
        onDownload={() => downloadReport(assessment)}
      />
    </>
  )
}
