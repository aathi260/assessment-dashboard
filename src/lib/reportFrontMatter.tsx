import type { Assessment } from '../schemas'

interface FrontMatterProps {
  assessment: Assessment
  generatedOn: string
}

export function ReportCover({ assessment, generatedOn }: FrontMatterProps) {
  return (
    <div className="relative min-h-[880px] overflow-hidden bg-white px-14 py-12">
      <div className="absolute inset-y-0 right-0 w-32 bg-[#f3f5f7]" />
      <div className="relative">
        <p className="text-[18px] font-semibold tracking-[0.12em] text-[#9e1414]">PREPARED FOR</p>
        <p className="mt-2 text-[38px] font-semibold text-[#172a3a]">ST Engineering</p>

        <div className="mt-20 h-1.5 w-20 bg-[#9e1414]" />
        <h1 className="mt-8 text-[64px] font-semibold leading-[1.1] text-[#172a3a]">
          SecureAI Assessment Report
        </h1>
        <p className="mt-6 text-[23px] text-[#566172]">Results, key findings and test sample evidence</p>

        <h2 className="mt-14 max-w-[1120px] text-[32px] font-medium break-words text-[#172a3a]">
          {assessment.productName}
        </h2>
        <dl className="mt-8 grid max-w-[1000px] grid-cols-2 gap-8 text-[21px]">
          <div>
            <dt className="text-[#566172]">Assessment ID</dt>
            <dd className="mt-2 font-semibold break-words text-[#172a3a]">{assessment.id}</dd>
          </div>
          <div>
            <dt className="text-[#566172]">Report generated</dt>
            <dd className="mt-2 font-semibold text-[#172a3a]">{generatedOn}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export function AboutReport({ assessment, generatedOn, sampleCount }: FrontMatterProps & { sampleCount: number }) {
  const score = assessment.overallScore
  const assessmentType = assessment.modelOutputType.charAt(0).toUpperCase() + assessment.modelOutputType.slice(1)
  const metadata = [
    ['Product', assessment.productName],
    ['Assessment ID', assessment.id],
    ['Assessment type', assessmentType],
    [
      'Overall score',
      score.status === 'scored' ? `${score.value} / ${score.max} (${score.value}% attack success rate)` : 'N/A',
    ],
    ['Samples reviewed', String(sampleCount)],
    ['Categories', String(assessment.categoryResults.length)],
    ['Report generated', generatedOn],
  ]
  const contents = [
    ['Assessment Overview', 'Headline results across all test samples.'],
    ['Summary & Key Findings', 'Plain-language findings and prioritised recommendations.'],
    ['Test Sample Details', 'Each sample compared with its modified inputs.'],
  ]
  const readingNotes = [
    'Confidence score shows how certain the model is of its result, from 0 to 1.',
    'pp (percentage points) is the absolute difference between two confidence percentages. A fall from 94.2% to 75.9% is 18.3 pp.',
    'A down arrow means confidence fell. An up arrow means it rose. Smaller falls are better.',
    'ADC, CRS, MCD and CDV summarise the average fall, the share of confidence retained, the worst single case and the consistency across cases.',
    'Overall Score is shown when the assessment has a defined pass/fail indicator. Otherwise it reads N/A and the confidence measurements still apply.',
    `Test techniques are grouped under ${assessment.categoryResults.length} category names and are not listed individually.`,
  ]

  return (
    <div className="grid grid-cols-2 items-start gap-14 bg-white p-3 text-[19px] leading-[1.5] text-[#17171c]">
      <div>
        <h2 className="text-[24px] font-semibold text-[#9e1414]">Purpose</h2>
        <p className="mt-3">
          This report summarises how the target model&apos;s confidence changes when its inputs are modified. Each test
          input is first submitted unchanged to set a baseline confidence, then again in modified forms. The report
          shows how far confidence falls, which kinds of modification have the greatest effect, and what to do about it.
        </p>

        <h2 className="mt-7 text-[24px] font-semibold text-[#9e1414]">What is inside</h2>
        <ol className="mt-3 space-y-4">
          {contents.map(([title, description], index) => (
            <li key={title} className="flex gap-4">
              <span className="font-semibold text-[#9e1414]">{index + 1}</span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-[#566172]">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <dl className="space-y-4 rounded-xl border border-[#d9dce1] bg-[#f5f6f8] p-6 text-[18px]">
          {metadata.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[190px_1fr] gap-4">
              <dt className="text-[#566172]">{label}</dt>
              <dd className="font-semibold break-words">{value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-7 text-[24px] font-semibold text-[#9e1414]">Reading the numbers</h2>
        <ul className="mt-3 space-y-2">
          {readingNotes.map((note) => (
            <li key={note} className="flex items-start gap-3">
              <span aria-hidden="true" className="shrink-0 text-[#9e1414]">
                •
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
