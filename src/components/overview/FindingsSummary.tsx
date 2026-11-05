import type { Assessment } from '../../schemas'
import { AlertIcon, ArrowRightIcon, ArrowUpRightIcon } from '../icons'
import { Card } from '../ui/Card'
import { SectionHeader } from '../ui/SectionHeader'
import { FindingsList } from './FindingsList'

export function FindingsSummary({ assessment, onOpen }: { assessment: Assessment; onOpen?: () => void }) {
  return (
    <Card className="flex flex-col p-5" aria-labelledby="findings-title">
      <SectionHeader
        id="findings-title"
        title="Summary & Key Findings"
        action={
          onOpen && (
            <button
              type="button"
              onClick={onOpen}
              aria-label="Open findings and recommendations"
              className="grid size-6 place-items-center rounded-full text-ink hover:bg-canvas"
            >
              <ArrowUpRightIcon size={14} />
            </button>
          )
        }
      />
      <p className="mt-4 font-inter text-sm leading-relaxed text-ink">{assessment.summary}</p>
      <FindingsList findings={assessment.findings} className="mt-5" itemClassName="text-sm text-slate" />

      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-4 flex w-full items-center justify-between rounded-lg bg-coral-tint/60 py-1.5 pl-1 font-inter text-sm font-medium text-coral hover:bg-coral-tint xl:mt-auto"
        >
          <span className="flex items-center gap-2.5">
            <AlertIcon size={16} />
            View All Findings &amp; Recommendations
          </span>
          <ArrowRightIcon size={15} className="mr-2" />
        </button>
      )}
    </Card>
  )
}
