import type { ConfidenceMetric } from '../../../schemas'
import { formatPercent } from '../../../lib/format'
import { Card } from '../../../components/ui/Card'
import { InfoButton } from '../../../components/ui/InfoButton'

export function ConfidenceMetricCard({ metric }: { metric: ConfidenceMetric }) {
  return (
    <Card className="flex min-h-kpi flex-col p-5" aria-label={metric.label}>
      <div className="flex items-start justify-between gap-2">
        <h2 className="max-w-[150px] text-sm font-medium leading-snug text-muted">{metric.label}</h2>
        <InfoButton label={metric.abbreviation} text={metric.description} />
      </div>
      <p className="mt-auto whitespace-nowrap pt-3 text-kpi font-extrabold text-ink tabular">
        {formatPercent(metric.valuePct)}
      </p>
    </Card>
  )
}
