import { useState } from 'react'
import { getSamplesFor } from '../data/repository'
import type { Assessment } from '../schemas'
import { AssessmentHeading } from '../components/layout/PageHeader'
import { DegradationChart } from '../components/overview/DegradationChart'
import { FindingsDialog } from '../components/overview/FindingsDialog'
import { FindingsSummary } from '../components/overview/FindingsSummary'
import { MetricCard } from '../components/overview/MetricCard'
import { SamplesTable } from '../components/overview/SamplesTable'
import { ScoreCard } from '../components/overview/ScoreCard'

export function OverviewPage({ assessment }: { assessment: Assessment }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <AssessmentHeading assessment={assessment} />

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
        <FindingsSummary assessment={assessment} onOpen={() => setDialogOpen(true)} />
      </div>

      <div className="mt-3.5">
        <SamplesTable assessmentId={assessment.id} samples={getSamplesFor(assessment)} />
      </div>

      <FindingsDialog assessment={assessment} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
