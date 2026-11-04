import { useMemo, useState } from 'react'
import {
  getAssessedInputs,
  getCategory,
  getReferenceInput,
  getSample,
  getSampleCategorySummaries,
} from '../../data/repository'
import type { Assessment, CategoryId } from '../../schemas'
import { NotFound } from '../../components/layout/NotFound'
import { AssessmentHeading } from '../../components/layout/AssessmentHeading'
import { AssessedInputsGrid } from './components/AssessedInputsGrid'
import { SampleCategoryResults } from './components/SampleCategoryResults'
import { InputComparisonCard } from './components/InputComparisonCard'
import { SampleHeaderCard } from './components/SampleHeaderCard'

export function SampleDetailPage({ assessment, sampleId }: { assessment: Assessment; sampleId: string }) {
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
        <SampleHeaderCard sample={sample} totalInputs={allInputs.length} />
        <SampleCategoryResults
          summaries={summaries}
          selected={categoryId}
          onSelect={(id) => {
            setCategoryId(id)
            setPickedId(getAssessedInputs(sampleId, id)[0]?.id)
          }}
        />
        <AssessedInputsGrid
          inputs={inputs}
          selectedId={selected?.id}
          onSelect={setPickedId}
          categoryLabel={getCategory(categoryId).label}
        />
        <InputComparisonCard reference={reference} input={selected} sampleLabel={sample.label} />
      </div>
    </>
  )
}
