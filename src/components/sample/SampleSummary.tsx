import type { ReactNode } from 'react'
import type { TestSample } from '../../schemas'
import { imageSrc } from '../../assets/images/registry'
import { formatConfidence } from '../../lib/format'
import { Card } from '../ui/Card'
import { Delta } from '../ui/Delta'
import { SectionHeader } from '../ui/SectionHeader'

function Metric({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <div className="min-w-[150px] flex-1 px-0 sm:px-6 sm:first:pl-0">
      <h3 className="text-lg font-normal text-ink-strong">{title}</h3>
      <div className="mt-2 text-[1.5rem] font-semibold leading-tight tabular">{children}</div>
      <p className="mt-1.5 text-sm font-medium text-ink-strong">{caption}</p>
    </div>
  )
}

export function SampleSummary({ sample, totalInputs }: { sample: TestSample; totalInputs: number }) {
  return (
    <Card className="p-5" aria-labelledby="sample-title">
      <SectionHeader
        id="sample-title"
        size="lg"
        title={`Sample ${sample.label}`}
        subtitle="View assessed inputs for this sample, including model outputs and results"
      />

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="relative aspect-[342/136] w-full max-w-[342px] shrink-0 overflow-hidden rounded-xl">
          <img
            src={imageSrc(sample.heroKey)}
            alt={`Reference input for sample ${sample.label}`}
            className="size-full object-cover"
          />
          <span className="absolute left-2.5 top-2.5 rounded-md bg-badge-dark/90 px-2 py-0.5 text-2xs font-medium text-white">
            {sample.label}
          </span>
        </div>

        <div className="flex flex-1 flex-col divide-y divide-divider sm:flex-row sm:divide-x sm:divide-y-0">
          <Metric title="Model Output (reference)" caption="Confidence score">
            {formatConfidence(sample.referenceConfidence)}
          </Metric>
          <Metric title="Overall Result" caption="Avg Confidence score">
            <Delta deltaPp={sample.headlineResultPp} />
          </Metric>
          <Metric title="Assessed Inputs" caption="Total unique inputs assessed for this sample">
            {totalInputs}
          </Metric>
        </div>
      </div>
    </Card>
  )
}
