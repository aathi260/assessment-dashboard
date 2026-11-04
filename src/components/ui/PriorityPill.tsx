import type { RecommendationPriority } from '../../schemas'
import { cn } from '../../lib/cn'

const styles: Record<RecommendationPriority, string> = {
  high: 'bg-priority-high-bg text-priority-high-fg',
  medium: 'bg-priority-medium-bg text-priority-medium-fg',
  low: 'bg-priority-low-bg text-priority-low-fg',
}
const labels: Record<RecommendationPriority, string> = { high: 'High', medium: 'Medium', low: 'Low' }

export function PriorityPill({ priority }: { priority: RecommendationPriority }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 w-[82px] items-center justify-center rounded-md text-xs font-semibold',
        styles[priority],
      )}
    >
      {labels[priority]}
    </span>
  )
}
