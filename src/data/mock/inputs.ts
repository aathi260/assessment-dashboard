import type { AssessedInput, CategoryId } from '../../schemas'

/**
 * Signed confidence change (pp) per assessed variant. Confidence is derived from these
 * (reference + delta/100), so the sample-level category cards always agree with the variants.
 * The S1 numbers are tuned so the category cards reproduce the mockup:
 *   Visual Perturbation avg −18.3 (6) · Image Transformation avg −12.3 (4)
 *   Adversarial Manipulation max "No change" (3) · Image Quality avg +4.7 (4)  → 17 inputs.
 */
const deltas: Record<string, Record<CategoryId, number[]>> = {
  s1: {
    'visual-perturbation': [-18.1, -22.0, -15.7, -20.4, -14.9, -18.7],
    'image-transformation': [-11.8, -14.2, -10.9, -12.3],
    'adversarial-manipulation': [0, 0, 0],
    'image-quality-degradation': [3.9, 5.6, 4.2, 5.1],
  },
  s2: {
    'visual-perturbation': [0, 0, 0],
    'image-transformation': [-6.2, -8.4, -4.9],
    'adversarial-manipulation': [-3.1, -7.8, -5.2],
    'image-quality-degradation': [1.8, 2.4, 1.1],
  },
  s3: {
    'visual-perturbation': [-6.4, -9.0, -5.5],
    'image-transformation': [-4.2, -7.7, -3.9],
    'adversarial-manipulation': [-18.3, -9.1, -12.6],
    'image-quality-degradation': [2.0, 3.1, 2.5],
  },
}

const baseline: Record<string, number> = { s1: 0.942, s2: 0.921, s3: 0.942 }
/** Which sample's image files a sample's variants reuse (S3 is the same dog photo as S1). */
const imageSource: Record<string, string> = { s1: 's1', s2: 's2', s3: 's1' }
const filePrefix: Record<CategoryId, string> = {
  'visual-perturbation': 'visual',
  'image-transformation': 'transform',
  'adversarial-manipulation': 'adversarial',
  'image-quality-degradation': 'quality',
}
const slug: Record<CategoryId, string> = {
  'visual-perturbation': 'visual',
  'image-transformation': 'transformation',
  'adversarial-manipulation': 'adversarial',
  'image-quality-degradation': 'quality',
}

export const assessedInputs: AssessedInput[] = Object.entries(deltas).flatMap(([sampleId, byCategory]) =>
  (Object.entries(byCategory) as [CategoryId, number[]][]).flatMap(([categoryId, list]) =>
    list.map((delta, index) => ({
      id: `${sampleId}-${slug[categoryId]}-${index + 1}`,
      sampleId,
      categoryId,
      label: `V${index + 1}`,
      order: index + 1,
      imageKey: `${imageSource[sampleId]}-${filePrefix[categoryId]}-${index + 1}`,
      confidence: Math.round(((baseline[sampleId] ?? 0) + delta / 100) * 1000) / 1000,
    })),
  ),
)
