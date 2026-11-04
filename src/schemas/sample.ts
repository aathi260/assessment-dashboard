import { z } from 'zod'
import { CategoryIdSchema } from './assessment'
import { ConfidenceScoreSchema, IdSchema, ImageKeySchema, PercentagePointsSchema } from './primitives'

export const TestSampleSchema = z.object({
  id: IdSchema,
  /** Display label, e.g. `S1`. */
  label: z.string().regex(/^S\d+$/),
  /** Image shown in the Test Samples table (thumbnail) and sample header. */
  thumbnailKey: ImageKeySchema,
  heroKey: ImageKeySchema,
  /** Model output on the reference input (confidence). */
  referenceConfidence: ConfidenceScoreSchema,
  /** Category the sample is primarily reported under in the table. */
  primaryCategoryId: CategoryIdSchema,
  /** Headline result in percentage points; 0 renders as "No change". */
  headlineResultPp: PercentagePointsSchema,
})
export type TestSample = z.infer<typeof TestSampleSchema>
