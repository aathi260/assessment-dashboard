import { z } from 'zod'
import {
  AssessedInputSchema,
  AssessmentCategorySchema,
  AssessmentSchema,
  ReferenceInputSchema,
  TestSampleSchema,
} from '../schemas'
import type { AssessedInput, Assessment, AssessmentCategory, ReferenceInput, TestSample } from '../schemas'
import { summariseSampleCategory } from '../lib/metrics'

export interface RawDataset {
  categories: unknown
  assessments: unknown
  samples: unknown
  referenceInputs: unknown
  assessedInputs: unknown
}

export interface Dataset {
  categories: AssessmentCategory[]
  assessments: Assessment[]
  samples: TestSample[]
  referenceInputs: ReferenceInput[]
  assessedInputs: AssessedInput[]
}

const uniqueIds = (rows: { id: string }[], what: string, issues: string[]) => {
  const seen = new Set<string>()
  for (const r of rows) {
    if (seen.has(r.id)) issues.push(`${what}: duplicate id "${r.id}"`)
    seen.add(r.id)
  }
}

/**
 * Schema-validates every collection, then checks cross-record relationships and the
 * numbers that appear on more than one screen. Returns human-readable issues.
 */
export function validateDataset(raw: RawDataset): { data?: Dataset; issues: string[] } {
  const issues: string[] = []
  const parse = <T extends z.ZodType>(schema: T, value: unknown, what: string): z.infer<T>[] => {
    const result = z.array(schema).safeParse(value)
    if (!result.success) {
      for (const i of result.error.issues) issues.push(`${what}[${i.path.join('.')}]: ${i.message}`)
      return []
    }
    return result.data
  }

  const categories = parse(AssessmentCategorySchema, raw.categories, 'categories')
  const assessments = parse(AssessmentSchema, raw.assessments, 'assessments')
  const samples = parse(TestSampleSchema, raw.samples, 'samples')
  const referenceInputs = parse(ReferenceInputSchema, raw.referenceInputs, 'referenceInputs')
  const assessedInputs = parse(AssessedInputSchema, raw.assessedInputs, 'assessedInputs')
  if (issues.length) return { issues }

  uniqueIds(categories, 'categories', issues)
  uniqueIds(assessments, 'assessments', issues)
  uniqueIds(samples, 'samples', issues)
  uniqueIds(referenceInputs, 'referenceInputs', issues)
  uniqueIds(assessedInputs, 'assessedInputs', issues)

  const categoryIds = new Set(categories.map((c) => c.id))
  const sampleById = new Map(samples.map((s) => [s.id, s]))

  for (const a of assessments) {
    const ctx = `assessment ${a.id}`
    for (const r of a.categoryResults)
      if (!categoryIds.has(r.categoryId)) issues.push(`${ctx}: unknown category ${r.categoryId}`)
    for (const id of a.sampleIds) if (!sampleById.has(id)) issues.push(`${ctx}: unknown sample ${id}`)
    // Findings must quote exactly the chart numbers.
    for (const f of a.findings) {
      const result = a.categoryResults.find((r) => r.categoryId === f.categoryId)
      if (!result) issues.push(`${ctx}: finding ${f.id} has no category result`)
      else if (result.degradationPct !== f.degradationPct)
        issues.push(`${ctx}: finding ${f.id} says ${f.degradationPct}% but the chart says ${result.degradationPct}%`)
      if (!f.statement.includes(`${f.degradationPct.toFixed(1)}%`))
        issues.push(`${ctx}: finding ${f.id} statement does not quote ${f.degradationPct.toFixed(1)}%`)
    }
    // CRS is defined as 100 − ADC.
    const adc = a.confidenceMetrics.find((m) => m.id === 'adc')
    const crs = a.confidenceMetrics.find((m) => m.id === 'crs')
    if (adc && crs && Math.abs(adc.valuePct + crs.valuePct - 100) > 0.05)
      issues.push(`${ctx}: ADC + CRS should equal 100`)
    // MCD cannot be smaller than the worst category average it summarises.
    const mcd = a.confidenceMetrics.find((m) => m.id === 'mcd')
    const worst = Math.max(...a.categoryResults.map((r) => r.degradationPct))
    if (mcd && mcd.valuePct < worst) issues.push(`${ctx}: MCD ${mcd.valuePct}% is below the worst category ${worst}%`)
  }

  const refBySample = new Map<string, ReferenceInput>()
  for (const r of referenceInputs) {
    if (!sampleById.has(r.sampleId)) issues.push(`reference ${r.id}: unknown sample ${r.sampleId}`)
    if (refBySample.has(r.sampleId)) issues.push(`sample ${r.sampleId}: more than one reference input`)
    refBySample.set(r.sampleId, r)
  }
  const orderKey = new Set<string>()
  for (const i of assessedInputs) {
    if (!sampleById.has(i.sampleId)) issues.push(`input ${i.id}: unknown sample ${i.sampleId}`)
    if (!categoryIds.has(i.categoryId)) issues.push(`input ${i.id}: unknown category ${i.categoryId}`)
    const key = `${i.sampleId}/${i.categoryId}/${i.label}`
    if (orderKey.has(key)) issues.push(`input ${i.id}: duplicate label ${key}`)
    orderKey.add(key)
  }

  for (const s of samples) {
    const ref = refBySample.get(s.id)
    if (!ref) {
      issues.push(`sample ${s.id}: missing reference input`)
      continue
    }
    if (ref.confidence !== s.referenceConfidence)
      issues.push(`sample ${s.id}: reference confidence ${s.referenceConfidence} ≠ reference input ${ref.confidence}`)
    // The table's headline result must equal the sample detail's category card.
    const cat = categories.find((c) => c.id === s.primaryCategoryId)
    if (cat) {
      const summary = summariseSampleCategory(
        cat,
        ref,
        assessedInputs.filter((i) => i.sampleId === s.id),
      )
      if (Math.abs(summary.deltaPp - s.headlineResultPp) > 0.05)
        issues.push(
          `sample ${s.id}: table shows ${s.headlineResultPp} pp but ${cat.label} card shows ${summary.deltaPp} pp`,
        )
    }
  }

  return issues.length
    ? { issues }
    : { data: { categories, assessments, samples, referenceInputs, assessedInputs }, issues }
}
