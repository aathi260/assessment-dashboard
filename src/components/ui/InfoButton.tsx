import { useId } from 'react'
import { InfoIcon } from '../icons'
import { cn } from '../../lib/cn'

/** Small (i) affordance with a hover/focus tooltip. */
export function InfoButton({
  label,
  text,
  tone = 'light',
  className,
}: {
  label: string
  text: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  const id = useId()
  return (
    <span className={cn('group relative inline-flex', className)}>
      <button
        type="button"
        aria-label={`About ${label}`}
        aria-describedby={id}
        className={cn(
          'grid size-5 place-items-center rounded-full',
          tone === 'dark'
            ? 'bg-white/15 text-white hover:bg-white/25'
            : 'bg-chip-grey text-slate hover:bg-chip-grey-hover',
        )}
      >
        <InfoIcon size={12} />
      </button>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none invisible absolute right-0 top-full z-30 mt-2 w-56 rounded-lg bg-ink px-3 py-2 text-xs font-normal leading-snug text-white opacity-0 shadow-pop transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}
