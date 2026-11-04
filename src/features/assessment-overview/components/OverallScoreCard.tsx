import type { OverallScore } from '../../../schemas'
import { InfoButton } from '../../../components/ui/InfoButton'

/** Overall score tile with its two explicit states: scored (`18 / 100`) and not applicable (`N/A`). */
export function OverallScoreCard({ score }: { score: OverallScore }) {
  return (
    <section
      aria-labelledby="overall-score-title"
      className="relative flex min-h-kpi flex-col rounded-card bg-gradient-to-br from-score-from to-score-to p-5 text-white shadow-score"
      data-state={score.status}
    >
      <div className="flex items-start justify-between">
        <h2 id="overall-score-title" className="text-base font-semibold">
          Overall Score
        </h2>
        <InfoButton
          tone="dark"
          label="Overall Score"
          text="A 0–100 summary of how well the model holds up under adversarial and transformation-based inputs."
        />
      </div>
      {score.status === 'scored' ? (
        <>
          <p className="mt-1 flex items-baseline gap-1.5 font-semibold tabular">
            <span className="text-score leading-none">{score.value}</span>
            <span className="text-lg font-medium">/ {score.max}</span>
          </p>
          <p className="mt-auto max-w-[210px] pt-3 text-xs font-medium leading-snug">{score.summary}</p>
        </>
      ) : (
        <>
          <p className="mt-1 text-score font-semibold leading-none">N/A</p>
          <p className="mt-auto pt-3 text-xs font-medium leading-snug">{score.reason}</p>
        </>
      )}
    </section>
  )
}
