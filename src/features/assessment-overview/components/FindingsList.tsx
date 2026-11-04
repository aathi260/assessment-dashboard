import type { Finding } from '../../../schemas'
import { cn } from '../../../lib/cn'

function NumberBadge({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-[22px] shrink-0 place-items-center rounded-full bg-coral-tint text-xs font-bold text-coral"
    >
      {n}
    </span>
  )
}

/** Numbered findings, shared by the summary card and the dialog (only the text colour differs). */
export function FindingsList({
  findings,
  className,
  itemClassName,
}: {
  findings: Finding[]
  className?: string
  itemClassName?: string
}) {
  return (
    <ol className={cn('space-y-3.5', className)}>
      {findings.map((f) => (
        <li key={f.id} className={cn('flex items-start gap-3 font-inter leading-snug', itemClassName)}>
          <NumberBadge n={f.rank} />
          <span className="pt-0.5">{f.statement}</span>
        </li>
      ))}
    </ol>
  )
}
