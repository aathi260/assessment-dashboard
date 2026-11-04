import type { AssessedInput, Assessment, AssessmentCategory, CategoryId, ReferenceInput, TestSample } from '../schemas'
import { summariseSampleCategory } from '../lib/assessmentMetrics'
import type { SampleCategorySummary } from '../lib/assessmentMetrics'
import { dataset } from './dataset'

/** Read-only accessors. The UI never touches raw arrays, so a real API can replace this file later. */

export const listAssessments = (): Assessment[] => dataset.assessments
export const getAssessment = (id: string): Assessment | undefined => dataset.assessments.find((a) => a.id === id)
export const getCategory = (id: CategoryId): AssessmentCategory => {
  const c = dataset.categories.find((x) => x.id === id)
  if (!c) throw new Error(`Unknown category ${id}`)
  return c
}
export const listCategories = (): AssessmentCategory[] => dataset.categories

export const getSamplesFor = (assessment: Assessment): TestSample[] =>
  assessment.sampleIds.flatMap((id) => dataset.samples.find((s) => s.id === id) ?? [])
export const getSample = (id: string): TestSample | undefined => dataset.samples.find((s) => s.id === id)
export const getReferenceInput = (sampleId: string): ReferenceInput | undefined =>
  dataset.referenceInputs.find((r) => r.sampleId === sampleId)
export const getAssessedInputs = (sampleId: string, categoryId?: CategoryId): AssessedInput[] =>
  dataset.assessedInputs
    .filter((i) => i.sampleId === sampleId && (categoryId === undefined || i.categoryId === categoryId))
    .sort((a, b) => a.order - b.order)

/** One summary per category for a sample ("Assessment Results (By Category)"). */
export function getSampleCategorySummaries(sampleId: string): SampleCategorySummary[] {
  const reference = getReferenceInput(sampleId)
  if (!reference) return []
  const inputs = getAssessedInputs(sampleId)
  return SAMPLE_CATEGORY_ORDER.map((id) => summariseSampleCategory(getCategory(id), reference, inputs))
}

/** Card order on the sample page (differs from the chart order on the overview). */
const SAMPLE_CATEGORY_ORDER: CategoryId[] = [
  'visual-perturbation',
  'image-transformation',
  'adversarial-manipulation',
  'image-quality-degradation',
]
