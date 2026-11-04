import { useMemo, useState } from 'react'
import {
  getAssessedInputs,
  getCategory,
  getReferenceInput,
  getSample,
  getSampleCategorySummaries,
} from '../data/repository'
import type { Assessment, CategoryId } from '../schemas'
import { paths } from '../lib/route'
import { AssessmentHeading } from '../components/layout/PageHeader'
import { AssessedInputs } from '../components/sample/AssessedInputs'
import { CategoryResults } from '../components/sample/CategoryResults'
import { InputComparison } from '../components/sample/InputComparison'
import { SampleSummary } from '../components/sample/SampleSummary'

export function SamplePage({ assessment, sampleId }: { assessment: Assessment; sampleId: string }) {
  const sample = getSample(sampleId)
  const reference = getReferenceInput(sampleId)
  if (!sample || !reference) return <NotFound assessmentId={assessment.id} what={`Sample “${sampleId}”`} />
  // Remount per sample so selection state never leaks between samples.
  return <SampleView key={sample.id} assessment={assessment} sampleId={sample.id} />
}

function SampleView({ assessment, sampleId }: { assessment: Assessment; sampleId: string }) {
  const sample = getSample(sampleId)!
  const reference = getReferenceInput(sampleId)!
  const summaries = useMemo(() => getSampleCategorySummaries(sampleId), [sampleId])
  const allInputs = useMemo(() => getAssessedInputs(sampleId), [sampleId])

  const [categoryId, setCategoryId] = useState<CategoryId>(sample.primaryCategoryId)
  const inputs = useMemo(() => getAssessedInputs(sampleId, categoryId), [sampleId, categoryId])
  const [pickedId, setPickedId] = useState<string | undefined>(
    () => getAssessedInputs(sampleId, sample.primaryCategoryId)[0]?.id,
  )
  // If the picked input belongs to another category, fall back to the first of the current one.
  const selected = inputs.find((i) => i.id === pickedId) ?? inputs[0]

  return (
    <>
      <AssessmentHeading assessment={assessment} trail={[{ label: sample.label }]} />

      <div className="space-y-3.5">
        <SampleSummary sample={sample} totalInputs={allInputs.length} />
        <CategoryResults
          summaries={summaries}
          selected={categoryId}
          onSelect={(id) => {
            setCategoryId(id)
            setPickedId(getAssessedInputs(sampleId, id)[0]?.id)
          }}
        />
        <AssessedInputs
          inputs={inputs}
          selectedId={selected?.id}
          onSelect={setPickedId}
          categoryLabel={getCategory(categoryId).label}
        />
        <InputComparison reference={reference} input={selected} sampleLabel={sample.label} />
      </div>
    </>
  )
}

export function NotFound({ assessmentId, what }: { assessmentId?: string; what: string }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-card bg-surface p-8 text-center shadow-card">
      <h1 className="text-lg font-medium">{what} was not found</h1>
      <a
        href={assessmentId ? paths.overview(assessmentId) : '#/'}
        className="mt-4 inline-block text-sm font-medium text-coral hover:underline"
      >
        Back to overview
      </a>
    </div>
  )
}
