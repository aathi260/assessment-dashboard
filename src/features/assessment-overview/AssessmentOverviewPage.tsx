import { useState } from 'react'
import { getSamplesFor } from '../../data/repository'
import type { Assessment } from '../../schemas'
import { AssessmentHeading } from '../../components/layout/AssessmentHeading'
import { CategoryDegradationChart } from './components/CategoryDegradationChart'
import { FindingsDialog } from './components/FindingsDialog'
import { KeyFindingsCard } from './components/KeyFindingsCard'
import { ConfidenceMetricCard } from './components/ConfidenceMetricCard'
import { TestSamplesTable } from './components/TestSamplesTable'
import { OverallScoreCard } from './components/OverallScoreCard'

export function AssessmentOverviewPage({ assessment }: { assessment: Assessment }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <AssessmentHeading assessment={assessment} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        <div className="col-span-2 md:col-span-4 xl:col-span-1">
          <OverallScoreCard score={assessment.overallScore} />
        </div>
        {assessment.confidenceMetrics.map((m) => (
          <ConfidenceMetricCard key={m.id} metric={m} />
        ))}
      </div>

      <div className="mt-3.5 grid gap-3.5 xl:grid-cols-[1.54fr_1fr]">
        <CategoryDegradationChart results={assessment.categoryResults} />
        <KeyFindingsCard assessment={assessment} onOpen={() => setDialogOpen(true)} />
      </div>

      <div className="mt-3.5">
        <TestSamplesTable assessmentId={assessment.id} samples={getSamplesFor(assessment)} />
      </div>

      <FindingsDialog assessment={assessment} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
