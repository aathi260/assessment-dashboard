import { useState } from 'react'
import { getSamplesFor } from '../data/repository'
import type { Assessment } from '../schemas'
import { AssessmentHeading } from '../components/layout/PageHeader'
import { FindingsDialog } from '../components/overview/FindingsDialog'
import { OverviewPanels } from '../components/overview/OverviewPanels'
import { SamplesTable } from '../components/overview/SamplesTable'

export function OverviewPage({ assessment }: { assessment: Assessment }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <AssessmentHeading assessment={assessment} />

      <OverviewPanels assessment={assessment} onOpenFindings={() => setDialogOpen(true)} />

      <div className="mt-3.5">
        <SamplesTable assessmentId={assessment.id} samples={getSamplesFor(assessment)} />
      </div>

      <FindingsDialog assessment={assessment} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
