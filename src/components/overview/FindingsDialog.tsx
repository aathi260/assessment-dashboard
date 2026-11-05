import { useEffect, useRef } from 'react'
import type { Assessment } from '../../schemas'
import { CloseIcon } from '../icons'
import { PriorityPill } from '../ui/PriorityPill'
import { FindingsList } from './FindingsList'

/** Modal built on the native <dialog>: focus trap, Esc to close and inert background come for free. */
export function FindingsDialog({
  assessment,
  open,
  onClose,
}: {
  assessment: Assessment
  open: boolean
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="findings-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(703px,calc(100vw-32px))] overflow-y-auto rounded-dialog bg-surface p-0 text-ink-strong shadow-pop backdrop:bg-overlay"
    >
      <div className="relative p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-slate hover:bg-canvas"
        >
          <CloseIcon size={16} />
        </button>

        <h2 id="findings-dialog-title" className="text-lg font-medium">
          Summary &amp; Key Findings
        </h2>
        <p className="mt-4 text-md leading-relaxed text-ink">{assessment.summary}</p>

        <FindingsList findings={assessment.findings} className="mt-5" itemClassName="text-md text-body" />

        <div className="mt-9">
          <RecommendationsTable recommendations={assessment.recommendations} />
        </div>
      </div>
    </dialog>
  )
}

export function RecommendationsTable({ recommendations }: { recommendations: Assessment['recommendations'] }) {
  return (
    <>
      <h2 className="text-lg font-medium">Recommendations</h2>
      <p className="mt-1 text-xs text-ink">Suggested actions to address findings and reduce risks.</p>

      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr className="font-inter text-sm font-semibold text-slate">
            <th scope="col" className="w-12 pb-3 font-semibold sm:w-20">
              #
            </th>
            <th scope="col" className="pb-3 font-semibold">
              Recommendations
            </th>
            <th scope="col" className="w-[82px] pb-3 text-center font-semibold sm:w-24">
              Priority
            </th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((r) => (
            <tr key={r.id} className="border-t border-divider">
              <td className="py-3 text-md font-semibold tabular">{r.order}</td>
              <td className="py-3 pr-3 text-md">{r.text}</td>
              <td className="py-3 text-center">
                <PriorityPill priority={r.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
