import { getCategory } from '../../data/repository'
import type { CategoryResult } from '../../schemas'
import { formatPercent } from '../../lib/format'
import { Card } from '../ui/Card'
import { SectionHeader } from '../ui/SectionHeader'

const ticks = [100, 80, 60, 40, 20, 0]
const barColors = ['bg-bar-1', 'bg-bar-2', 'bg-bar-3', 'bg-bar-4'] as const
const labelColors = ['text-bar-1', 'text-bar-2', 'text-bar-3', 'text-bar-4'] as const

/** Vertical bar chart (0–100 %) built from plain elements so it scales with the card. */
export function DegradationChart({ results }: { results: CategoryResult[] }) {
  // Colour follows rank (darkest = most degraded), not position.
  const rank = new Map(
    [...results].sort((a, b) => b.degradationPct - a.degradationPct).map((r, i) => [r.categoryId, i]),
  )

  return (
    <Card className="p-5 sm:px-5" aria-labelledby="degradation-title">
      <SectionHeader id="degradation-title" title="Degradation By Category" />

      <figure className="mt-5" aria-label="Degradation by category bar chart">
        <div className="flex gap-3">
          {/* y axis */}
          <div className="relative h-chart w-8 shrink-0 font-inter text-2xs text-slate" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} className="absolute right-0 -translate-y-1/2 tabular" style={{ top: `${100 - t}%` }}>
                {t}%
              </span>
            ))}
          </div>

          {/* plot */}
          <div className="relative h-chart min-w-0 flex-1">
            {ticks.map((t) => (
              <div
                key={t}
                aria-hidden="true"
                className="absolute inset-x-0 border-t border-dotted border-grid-line"
                style={{ top: `${100 - t}%` }}
              />
            ))}
            <ul className="absolute inset-0 grid grid-cols-4">
              {results.map((r) => {
                const i = Math.min(rank.get(r.categoryId) ?? 0, 3)
                return (
                  <li
                    key={r.categoryId}
                    className="relative flex items-end justify-center"
                    data-category={r.categoryId}
                  >
                    <div className="relative w-[58%] max-w-[68px]" style={{ height: `${r.degradationPct}%` }}>
                      <span
                        className={`absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold tabular ${labelColors[i]}`}
                      >
                        {formatPercent(r.degradationPct)}
                      </span>
                      <div
                        role="img"
                        aria-label={`${getCategory(r.categoryId).label}: ${formatPercent(r.degradationPct)}`}
                        className={`h-full min-h-3 w-full rounded-bar ${barColors[i]} transition-[height] duration-700`}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* x labels */}
        <div className="ml-11 mt-2 grid grid-cols-4 text-center text-2xs leading-tight text-slate sm:text-xs">
          {results.map((r) => (
            <span key={r.categoryId} className="px-1">
              {getCategory(r.categoryId).label}
            </span>
          ))}
        </div>
      </figure>
    </Card>
  )
}
