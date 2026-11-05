import type { Assessment } from '../../schemas'
import { DegradationChart } from './DegradationChart'
import { FindingsSummary } from './FindingsSummary'
import { MetricCard } from './MetricCard'
import { ScoreCard } from './ScoreCard'

export function OverviewPanels({
  assessment,
  onOpenFindings,
}: {
  assessment: Assessment
  onOpenFindings?: () => void
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        <div className="col-span-2 md:col-span-4 xl:col-span-1">
          <ScoreCard score={assessment.overallScore} />
        </div>
        {assessment.confidenceMetrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>

      <div className="mt-3.5 grid gap-3.5 xl:grid-cols-[1.54fr_1fr]">
        <DegradationChart results={assessment.categoryResults} />
        <FindingsSummary assessment={assessment} onOpen={onOpenFindings} />
      </div>
    </>
  )
}
