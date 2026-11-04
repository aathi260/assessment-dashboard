import { dataset } from '../src/data/dataset'

// Importing the dataset already validates it (and throws with a readable list on failure).
console.log(
  `✔ mock data valid: ${dataset.assessments.length} assessments, ${dataset.samples.length} samples, ` +
    `${dataset.referenceInputs.length} reference inputs, ${dataset.assessedInputs.length} assessed inputs`,
)
