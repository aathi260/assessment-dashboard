import { getCategory } from '../../data/repository'
import type { TestSample } from '../../schemas'
import { formatConfidence } from '../../lib/format'
import { paths } from '../../lib/route'
import { ChevronRightIcon } from '../icons'
import { Card } from '../ui/Card'
import { Delta } from '../ui/Delta'
import { SectionHeader } from '../ui/SectionHeader'
import { ThumbStack } from '../ui/ThumbStack'

const cols = 'sm:grid sm:grid-cols-[48px_minmax(150px,1.5fr)_1fr_1fr_1.3fr_28px] sm:items-center sm:gap-4'

export function SamplesTable({ assessmentId, samples }: { assessmentId: string; samples: TestSample[] }) {
  return (
    <Card className="p-5" aria-labelledby="samples-title">
      <SectionHeader id="samples-title" title="Test Samples" />

      <div role="table" aria-label="Test samples" className="mt-5">
        <div role="row" className={`hidden border-b border-divider pb-3 text-xs font-semibold text-slate ${cols}`}>
          <span role="columnheader" className="font-inter pl-1">
            #
          </span>
          <span role="columnheader">Sample Input</span>
          <span role="columnheader">Model Output</span>
          <span role="columnheader">Result</span>
          <span role="columnheader">Category</span>
          <span role="columnheader" className="sr-only">
            Open
          </span>
        </div>

        {samples.map((s) => (
          <a
            key={s.id}
            role="row"
            href={paths.sample(assessmentId, s.id)}
            aria-label={`Open sample ${s.label}`}
            className={`group flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-divider py-3 last:border-b-0 hover:bg-canvas ${cols}`}
          >
            <span role="cell" className="w-10 pl-1 text-md font-semibold sm:w-auto">
              {s.label}
            </span>
            <span role="cell">
              <ThumbStack imageKey={s.thumbnailKey} alt={`Sample ${s.label}`} />
            </span>
            <span role="cell" className="min-w-[90px]">
              <span className="block text-md font-semibold tabular">{formatConfidence(s.referenceConfidence)}</span>
              <span className="block text-2xs text-slate">Confidence Score</span>
            </span>
            <span role="cell" className="min-w-[80px] text-sm">
              <Delta
                deltaPp={s.headlineResultPp}
                className="text-md"
                noChangeClassName="text-sm font-medium text-subtle"
              />
            </span>
            <span role="cell" className="min-w-[140px] text-sm font-medium">
              {getCategory(s.primaryCategoryId).label}
            </span>
            <span role="cell" className="ml-auto text-ink-strong transition-transform group-hover:translate-x-0.5">
              <ChevronRightIcon size={16} />
            </span>
          </a>
        ))}
      </div>
    </Card>
  )
}
