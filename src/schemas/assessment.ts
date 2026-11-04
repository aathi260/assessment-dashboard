import { z } from 'zod'
import { IdSchema, PercentSchema } from './primitives'

/** The kind of model output being assessed (shown in the "Image" pill in the page header). */
export const ModelOutputTypeSchema = z.enum(['image', 'text', 'audio', 'video'])
export type ModelOutputType = z.infer<typeof ModelOutputTypeSchema>

/**
 * Overall score has two explicit states. `not_applicable` is a first-class state
 * (slide 2 of the mockup), never `null`/`0`.
 */
export const OverallScoreSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('scored'),
    value: z.number().int().min(0).max(100),
    max: z.literal(100),
    summary: z.string().min(1),
  }),
  z.object({
    status: z.literal('not_applicable'),
    reason: z.string().min(1),
  }),
])
export type OverallScore = z.infer<typeof OverallScoreSchema>

export const ConfidenceMetricIdSchema = z.enum(['adc', 'crs', 'mcd', 'cdv'])
export type ConfidenceMetricId = z.infer<typeof ConfidenceMetricIdSchema>

export const ConfidenceMetricSchema = z.object({
  id: ConfidenceMetricIdSchema,
  abbreviation: z.string().min(2).max(4),
  label: z.string().min(1),
  /** Metric value as a percentage (0–100). */
  valuePct: PercentSchema,
  /** Shown in the (i) tooltip. */
  description: z.string().min(1),
})
export type ConfidenceMetric = z.infer<typeof ConfidenceMetricSchema>

export const CategoryIdSchema = z.enum([
  'adversarial-manipulation',
  'visual-perturbation',
  'image-transformation',
  'image-quality-degradation',
])
export type CategoryId = z.infer<typeof CategoryIdSchema>

/**
 * How a sample-level category result aggregates its variants:
 * `average` → mean change, `maximum` → worst-case (largest) degradation.
 */
export const AggregationSchema = z.enum(['average', 'maximum'])
export type Aggregation = z.infer<typeof AggregationSchema>

export const AssessmentCategorySchema = z.object({
  id: CategoryIdSchema,
  label: z.string().min(1),
  aggregation: AggregationSchema,
})
export type AssessmentCategory = z.infer<typeof AssessmentCategorySchema>

/** Assessment-level result for one category (one bar in "Degradation By Category"). */
export const CategoryResultSchema = z.object({
  categoryId: CategoryIdSchema,
  degradationPct: PercentSchema,
})
export type CategoryResult = z.infer<typeof CategoryResultSchema>

export const FindingSchema = z.object({
  id: IdSchema,
  /** 1-based display order (also the rank by degradation, highest first). */
  rank: z.number().int().min(1),
  categoryId: CategoryIdSchema,
  degradationPct: PercentSchema,
  statement: z.string().min(1),
})
export type Finding = z.infer<typeof FindingSchema>

export const RecommendationPrioritySchema = z.enum(['high', 'medium', 'low'])
export type RecommendationPriority = z.infer<typeof RecommendationPrioritySchema>

export const RecommendationSchema = z.object({
  id: IdSchema,
  order: z.number().int().min(1),
  text: z.string().min(1),
  priority: RecommendationPrioritySchema,
})
export type Recommendation = z.infer<typeof RecommendationSchema>

export const AssessmentSchema = z.object({
  id: IdSchema,
  productName: z.string().min(1),
  modelOutputType: ModelOutputTypeSchema,
  overallScore: OverallScoreSchema,
  confidenceMetrics: z.array(ConfidenceMetricSchema).length(4),
  categoryResults: z.array(CategoryResultSchema).min(1),
  summary: z.string().min(1),
  findings: z.array(FindingSchema).min(1),
  recommendations: z.array(RecommendationSchema).min(1),
  /** Ordered ids of the test samples shown in the "Test Samples" table. */
  sampleIds: z.array(IdSchema).min(1),
})
export type Assessment = z.infer<typeof AssessmentSchema>
