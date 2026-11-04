import { validateDataset } from './validate'
import type { Dataset } from './validate'
import { assessedInputs, assessments, categories, referenceInputs, samples } from './mock'

const result = validateDataset({ categories, assessments, samples, referenceInputs, assessedInputs })

if (!result.data) {
  // Fail loudly: bad mock data should never render a half-correct dashboard.
  throw new Error(`Mock data failed validation:\n - ${result.issues.join('\n - ')}`)
}

/** Schema-validated, cross-checked dataset used by the whole UI. */
export const dataset: Dataset = result.data
