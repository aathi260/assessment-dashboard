import { getCategory } from '../../data/repository'
import type { CategoryId } from '../../schemas'
import type { SampleCategorySummary } from '../../lib/metrics'
import { formatConfidence } from '../../lib/format'
import { Card } from '../ui/Card'
import { Delta } from '../ui/Delta'
import { InfoButton } from '../ui/InfoButton'
import { SectionHeader } from '../ui/SectionHeader'
import { SelectableCard } from '../ui/SelectableCard'

const AGGREGATION_LABEL = { average: 'Average degradation', maximum: 'Maximum degradation' } as const

interface CategoryResultsProps {
  summaries: SampleCategorySummary[]
  selected: CategoryId
  onSelect?: (id: CategoryId) => void
}

export function CategoryResults({ summaries, selected, onSelect }: CategoryResultsProps) {
  return (
    <Card className="p-5" aria-labelledby="category-results-title">
      <SectionHeader
        id="category-results-title"
        size="lg"
        title="Assessment Results ( By Category )"
        subtitle="Summary of results for this sample across different assessment categories"
        action={
          onSelect && (
            <InfoButton
              label="category results"
              text="Select a category to see the assessed inputs behind its result."
            />
          )
        }
      />

      <div
        role={onSelect ? 'radiogroup' : undefined}
        aria-label="Assessment category"
        className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {summaries.map((s) => (
          <SelectableCard
            key={s.categoryId}
            name="category"
            checked={s.categoryId === selected}
            onSelect={onSelect && (() => onSelect(s.categoryId))}
            className="p-4"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="text-md text-ink-strong">{getCategory(s.categoryId).label}</span>
              <span className="shrink-0 text-2xs text-ink-strong">{s.variantCount} Variants</span>
            </span>
            <span className="mt-2 block text-xs font-medium text-ink-strong">{AGGREGATION_LABEL[s.aggregation]}</span>
            <span className="mt-2 block text-[1.5rem] font-bold leading-tight">
              <Delta deltaPp={s.deltaPp} noChangeClassName="text-heading font-semibold text-ink-strong" />
            </span>
            <span className="mt-3 block text-xs font-medium text-ink-strong">
              Baseline confidence: {formatConfidence(s.baselineConfidence)}
            </span>
          </SelectableCard>
        ))}
      </div>
    </Card>
  )
}
