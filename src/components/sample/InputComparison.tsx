import type { AssessedInput, ReferenceInput } from '../../schemas'
import { imageSrc } from '../../assets/images/registry'
import { formatConfidence } from '../../lib/format'
import { inputDeltaPp } from '../../lib/metrics'
import { SwapIcon } from '../icons'
import { Card } from '../ui/Card'
import { Delta } from '../ui/Delta'
import { SectionHeader } from '../ui/SectionHeader'

function Panel({ label, imageKey, alt }: { label: string; imageKey: string; alt: string }) {
  return (
    <figure className="min-w-0 flex-1 rounded-xl bg-chip-blue p-2.5">
      <figcaption className="mb-2 text-xs font-medium text-ink-strong">{label}</figcaption>
      <img src={imageSrc(imageKey)} alt={alt} className="aspect-[356/197] w-full rounded-lg object-cover" />
    </figure>
  )
}

export function InputComparison({
  reference,
  input,
  sampleLabel,
  report = false,
}: {
  reference: ReferenceInput
  input: AssessedInput | undefined
  sampleLabel: string
  report?: boolean
}) {
  return (
    <Card className="p-5" aria-labelledby="selected-input-title">
      <SectionHeader
        id="selected-input-title"
        size="lg"
        title="Selected Input Details"
        subtitle="Comparison of the reference input and selected assessed input"
      />

      {input ? (
        <div className="mt-5 flex flex-col gap-6 xl:flex-row xl:items-center">
          <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Panel
              label="Reference Input"
              imageKey={reference.imageKey}
              alt={`Reference input for sample ${sampleLabel}`}
            />
            <span
              className="mx-auto grid size-[68px] shrink-0 place-items-center rounded-full bg-surface text-ink-strong shadow-float max-sm:rotate-90 max-sm:size-12"
              aria-hidden="true"
            >
              <SwapIcon size={20} />
            </span>
            <Panel
              label={`Selected Assessed Input (${input.label})`}
              imageKey={input.imageKey}
              alt={`Assessed input ${input.label}`}
            />
          </div>

          <table className="w-full shrink-0 text-left xl:w-[260px]">
            <thead>
              <tr className="text-xs font-semibold text-slate">
                <th scope="col" className="pb-3 font-semibold">
                  Category
                </th>
                <th scope="col" className="pb-3 text-right font-semibold xl:text-left">
                  Confidence Score
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-t border-divider">
                <th scope="row" className="py-4 font-normal text-slate">
                  Reference Input
                </th>
                <td className="py-4 text-right font-semibold text-navy tabular xl:text-left">
                  {formatConfidence(reference.confidence)}
                </td>
              </tr>
              <tr className="border-t border-divider">
                <th scope="row" className="py-4 font-normal text-slate">
                  Assessed Input
                </th>
                <td className="py-4 text-right font-semibold text-navy tabular xl:text-left">
                  {formatConfidence(input.confidence)}
                </td>
              </tr>
              <tr className="border-t border-divider">
                <th scope="row" className="py-4 font-normal text-slate">
                  Measured Changes
                </th>
                <td className="py-4 text-right text-base xl:text-left">
                  <Delta deltaPp={inputDeltaPp(input, reference)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-chip-blue p-6 text-sm text-slate">
          {report
            ? 'No assessed input is available in this category.'
            : 'Select an assessed input above to compare it with the reference input.'}
        </p>
      )}
    </Card>
  )
}
