import { z } from 'zod'
import { CategoryIdSchema } from './assessment'
import { ConfidenceScoreSchema, IdSchema, ImageKeySchema } from './primitives'

/** The untouched input the model was first run on. One per sample. */
export const ReferenceInputSchema = z.object({
  id: IdSchema,
  sampleId: IdSchema,
  imageKey: ImageKeySchema,
  confidence: ConfidenceScoreSchema,
})
export type ReferenceInput = z.infer<typeof ReferenceInputSchema>

/** A perturbed/transformed variant of a sample's reference input, e.g. `V1` of Visual Perturbation. */
export const AssessedInputSchema = z.object({
  id: IdSchema,
  sampleId: IdSchema,
  categoryId: CategoryIdSchema,
  /** Label within its category, e.g. `V1`. */
  label: z.string().regex(/^V\d+$/),
  order: z.number().int().min(1),
  imageKey: ImageKeySchema,
  confidence: ConfidenceScoreSchema,
})
export type AssessedInput = z.infer<typeof AssessedInputSchema>
