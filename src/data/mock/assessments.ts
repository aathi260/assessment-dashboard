import type { Assessment, ConfidenceMetric, Recommendation } from '../../schemas'
import { buildFindings } from '../../lib/assessmentMetrics'
import { categories } from './categories'

/**
 * Category degradation (the bar chart). This is the single source of truth for the
 * numbers quoted in "Summary & Key Findings" — see README "Conflicts in the mockup".
 */
const categoryResults: Assessment['categoryResults'] = [
  { categoryId: 'adversarial-manipulation', degradationPct: 62.1 },
  { categoryId: 'visual-perturbation', degradationPct: 42.4 },
  { categoryId: 'image-transformation', degradationPct: 18.3 },
  { categoryId: 'image-quality-degradation', degradationPct: 4.7 },
]

const confidenceMetrics: ConfidenceMetric[] = [
  {
    id: 'adc',
    abbreviation: 'ADC',
    label: 'Adversarial Confidence Degradation (ADC)',
    valuePct: 42.6,
    description:
      'Average drop in model confidence across adversarial and transformed inputs, relative to the reference input.',
  },
  {
    id: 'crs',
    abbreviation: 'CRS',
    label: 'Confidence Retention Score (CRS)',
    valuePct: 57.4,
    description: 'Share of the reference confidence the model keeps on average under perturbation (100% − ADC).',
  },
  {
    id: 'mcd',
    abbreviation: 'MCD',
    label: 'Maximum Confidence Degradation (MCD)',
    valuePct: 78.2,
    description: 'Largest single confidence drop observed across all assessed inputs.',
  },
  {
    id: 'cdv',
    abbreviation: 'CDV',
    label: 'Confidence Degradation Variability (CDV)',
    valuePct: 12.8,
    description:
      'Spread of confidence degradation across assessed inputs. Lower values mean more consistent behaviour.',
  },
]

const recommendations: Recommendation[] = [
  { id: 'rec-1', order: 1, text: 'Improve robustness against adversarial manipulation techniques', priority: 'high' },
  { id: 'rec-2', order: 2, text: 'Enhance detection for transformation-based inputs', priority: 'medium' },
  { id: 'rec-3', order: 3, text: 'Increase training data diversity for image variations', priority: 'medium' },
  { id: 'rec-4', order: 4, text: 'Monitor emerging attack patterns on product assets', priority: 'low' },
]

const shared: Omit<Assessment, 'id' | 'overallScore'> = {
  productName: 'Product Name',
  modelOutputType: 'image',
  confidenceMetrics,
  categoryResults,
  summary:
    'The model shows changes in confidence under adversarial and transformation-based inputs, with the highest degradation observed for adversarial manipulation.',
  findings: buildFindings(categoryResults, categories),
  recommendations,
  sampleIds: ['s1', 's2', 's3'],
}

export const assessments: Assessment[] = [
  {
    ...shared,
    id: 'asm-001',
    overallScore: {
      status: 'scored',
      value: 18,
      max: 100,
      summary: 'Model Shows strong resilience with low attack success rate',
    },
  },
  {
    ...shared,
    id: 'asm-002',
    overallScore: { status: 'not_applicable', reason: 'Not applicable for this model output.' },
  },
]
