import { changeDirection, formatPp, formatPpMagnitude } from '../../lib/format'
import { cn } from '../../lib/cn'

/** Signed confidence change: ↓ coral (degradation), ↑ green (improvement), "No change" neutral. */
export function Delta({
  deltaPp,
  className,
  noChangeClassName,
}: {
  deltaPp: number
  className?: string
  noChangeClassName?: string
}) {
  const dir = changeDirection(deltaPp)
  if (dir === 'none') return <span className={noChangeClassName ?? cn('text-subtle', className)}>{formatPp(0)}</span>
  const words = dir === 'down' ? 'decreased' : 'increased'
  return (
    <span className={cn('whitespace-nowrap font-bold', dir === 'down' ? 'text-coral' : 'text-positive', className)}>
      <span aria-hidden="true">
        {dir === 'down' ? '↓' : '↑'} {formatPpMagnitude(deltaPp)}
      </span>
      <span className="sr-only">
        {words} by {formatPpMagnitude(deltaPp)}
      </span>
    </span>
  )
}
