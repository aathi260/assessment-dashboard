import type { AssessedInput, AssessmentCategory, CategoryResult, Finding, ReferenceInput } from '../schemas'
import { roundPp, sentenceCase } from './format'

/** Signed confidence change (percentage points) of one assessed input vs its reference. */
export function inputDeltaPp(
  input: Pick<AssessedInput, 'confidence'>,
  reference: Pick<ReferenceInput, 'confidence'>,
): number {
  return roundPp((input.confidence - reference.confidence) * 100)
}

export interface SampleCategorySummary {
  categoryId: AssessmentCategory['id']
  aggregation: AssessmentCategory['aggregation']
  /** Signed pp. For `maximum` this is the worst (most negative) change, or 0 when nothing degraded. */
  deltaPp: number
  variantCount: number
  baselineConfidence: number
}

/** Aggregates one sample's variants within one category (average or worst-case). */
export function summariseSampleCategory(
  category: AssessmentCategory,
  reference: ReferenceInput,
  inputs: readonly AssessedInput[],
): SampleCategorySummary {
  const own = inputs.filter((i) => i.categoryId === category.id)
  const deltas = own.map((i) => inputDeltaPp(i, reference))
  let deltaPp = 0
  if (deltas.length > 0) {
    deltaPp =
      category.aggregation === 'maximum'
        ? Math.min(0, ...deltas)
        : roundPp(deltas.reduce((a, b) => a + b, 0) / deltas.length)
  }
  return {
    categoryId: category.id,
    aggregation: category.aggregation,
    deltaPp,
    variantCount: own.length,
    baselineConfidence: reference.confidence,
  }
}

/** Builds the numbered findings from assessment-level category results (single source of truth = the chart data). */
export function buildFindings(
  results: readonly CategoryResult[],
  categories: readonly AssessmentCategory[],
): Finding[] {
  const label = (id: CategoryResult['categoryId']) => categories.find((c) => c.id === id)?.label ?? id
  const sorted = [...results].sort((a, b) => b.degradationPct - a.degradationPct)
  return sorted.map((r, index) => {
    const name = sentenceCase(label(r.categoryId))
    const pct = `${r.degradationPct.toFixed(1)}%`
    const last = index === sorted.length - 1
    const statement =
      index === 0
        ? `${name} recorded the highest confidence degradation at ${pct}.`
        : last
          ? `${name} had the lowest impact at ${pct}.`
          : index % 2 === 1
            ? `${name} resulted in ${pct} degradation.`
            : `${name} showed ${pct} degradation.`
    return {
      id: `finding-${index + 1}`,
      rank: index + 1,
      categoryId: r.categoryId,
      degradationPct: r.degradationPct,
      statement,
    }
  })
}
