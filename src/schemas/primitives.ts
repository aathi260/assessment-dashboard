import { z } from 'zod'

/** Stable, human-readable identifier, e.g. `asm-001`, `s1`, `s1-visual-1`. */
export const IdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ids are lowercase kebab-case')

/** Model confidence on a 0–1 scale (e.g. 0.942). */
export const ConfidenceScoreSchema = z.number().min(0).max(1)

/** Percentage on a 0–100 scale (e.g. 62.1). */
export const PercentSchema = z.number().min(0).max(100)

/**
 * Signed change in confidence expressed in percentage points.
 * Negative = confidence dropped (degradation), positive = confidence rose, 0 = no change.
 */
export const PercentagePointsSchema = z.number().min(-100).max(100)

/** Key into the image registry (`src/assets/images/registry.ts`). Keeps data free of bundler URLs. */
export const ImageKeySchema = z.string().min(1)
