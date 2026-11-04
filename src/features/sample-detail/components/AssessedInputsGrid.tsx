import { useState } from 'react'
import type { AssessedInput } from '../../../schemas'
import { imageSrc } from '../../../assets/images/registry'
import { ArrowDownIcon, ArrowUpIcon, CheckBadge } from '../../../components/icons'
import { Card } from '../../../components/ui/Card'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { SelectableCard } from '../../../components/ui/SelectableCard'

/** Inputs visible before "View all inputs" is pressed. */
const COLLAPSED_COUNT = 4

interface AssessedInputsProps {
  inputs: AssessedInput[]
  selectedId: string | undefined
  onSelect: (id: string) => void
  categoryLabel: string
}

/** The inputs to render: all when expanded (or short), else the first few — always including the selection. */
function visibleInputs(inputs: AssessedInput[], expanded: boolean, selectedId: string | undefined): AssessedInput[] {
  if (expanded || inputs.length <= COLLAPSED_COUNT) return inputs
  const head = inputs.slice(0, COLLAPSED_COUNT)
  const selected = inputs.find((i) => i.id === selectedId)
  return !selected || head.includes(selected) ? head : [...head.slice(0, COLLAPSED_COUNT - 1), selected]
}

export function AssessedInputsGrid({ inputs, selectedId, onSelect, categoryLabel }: AssessedInputsProps) {
  const [expanded, setExpanded] = useState(false)
  const canExpand = inputs.length > COLLAPSED_COUNT
  const shown = visibleInputs(inputs, expanded, selectedId)

  return (
    <Card className="p-5" aria-labelledby="assessed-inputs-title">
      <SectionHeader
        id="assessed-inputs-title"
        size="lg"
        title="Assessed Inputs"
        subtitle={
          <>
            Select an assessed input to view its result. <span className="text-slate">· {categoryLabel}</span>
          </>
        }
        className="flex-wrap items-end"
        action={
          <p className="flex items-center gap-3 text-sm text-ink-strong">
            <span aria-live="polite">
              Showing {shown.length} of {inputs.length} inputs
            </span>
            {canExpand && (
              <>
                <span className="h-3.5 w-px bg-divider" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="inline-flex items-center gap-1 font-medium text-brand-link hover:underline"
                >
                  {expanded ? 'Show fewer' : 'View all inputs'}
                  {expanded ? <ArrowUpIcon size={13} /> : <ArrowDownIcon size={13} />}
                </button>
              </>
            )}
          </p>
        }
      />

      <div role="radiogroup" aria-label="Assessed inputs" className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {shown.map((input) => (
          <SelectableCard
            key={input.id}
            name="assessed-input"
            checked={input.id === selectedId}
            onSelect={() => onSelect(input.id)}
            ariaLabel={`Variant ${input.label}`}
            className="overflow-hidden p-[3px] pb-0"
          >
            <img
              src={imageSrc(input.imageKey)}
              alt=""
              loading="lazy"
              className="aspect-[275/122] w-full rounded-lg object-cover"
            />
            {input.id === selectedId && (
              <span className="absolute right-2 top-2 drop-shadow">
                <CheckBadge size={22} />
              </span>
            )}
            <span className="block py-1 text-center text-xs font-bold text-ink-strong">{input.label}</span>
          </SelectableCard>
        ))}
      </div>
    </Card>
  )
}
