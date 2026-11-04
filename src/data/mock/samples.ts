import type { ReferenceInput, TestSample } from '../../schemas'

/** Test Samples table rows (S1–S3 as in the mockup). Confidence values are the reference model outputs. */
export const samples: TestSample[] = [
  {
    id: 's1',
    label: 'S1',
    thumbnailKey: 'sample-dog',
    heroKey: 'hero-s1',
    referenceConfidence: 0.942,
    primaryCategoryId: 'visual-perturbation',
    headlineResultPp: -18.3,
  },
  {
    id: 's2',
    label: 'S2',
    thumbnailKey: 'sample-car',
    heroKey: 'sample-car',
    referenceConfidence: 0.921,
    primaryCategoryId: 'visual-perturbation',
    headlineResultPp: 0,
  },
  {
    id: 's3',
    label: 'S3',
    thumbnailKey: 'sample-dog',
    heroKey: 'hero-s1',
    referenceConfidence: 0.942,
    primaryCategoryId: 'adversarial-manipulation',
    headlineResultPp: -18.3,
  },
]

export const referenceInputs: ReferenceInput[] = [
  { id: 'ref-s1', sampleId: 's1', imageKey: 'reference-dog', confidence: 0.942 },
  { id: 'ref-s2', sampleId: 's2', imageKey: 'sample-car', confidence: 0.921 },
  { id: 'ref-s3', sampleId: 's3', imageKey: 'reference-dog', confidence: 0.942 },
]
