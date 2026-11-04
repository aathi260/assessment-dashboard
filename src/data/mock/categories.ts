import type { AssessmentCategory } from '../../schemas'

/** Category catalogue. Labels come straight from the mockup. */
export const categories: AssessmentCategory[] = [
  { id: 'adversarial-manipulation', label: 'Adversarial Manipulation', aggregation: 'maximum' },
  { id: 'visual-perturbation', label: 'Visual Perturbation', aggregation: 'average' },
  { id: 'image-transformation', label: 'Image Transformation', aggregation: 'average' },
  { id: 'image-quality-degradation', label: 'Image Quality Degradation', aggregation: 'average' },
]
