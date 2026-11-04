import { getAssessment, listAssessments } from '../data/repository'
import { useRoute } from './routes'
import { NotFound } from '../components/layout/NotFound'
import { AppShell } from '../components/layout/AppShell'
import { DemoStateSwitcher } from '../components/layout/DemoStateSwitcher'
import { SampleDetailPage } from '../features/sample-detail/SampleDetailPage'
import { AssessmentOverviewPage } from '../features/assessment-overview/AssessmentOverviewPage'

export default function App() {
  const route = useRoute()
  const first = listAssessments()[0]
  const assessmentId = route.name === 'home' ? first?.id : route.assessmentId
  const assessment = assessmentId ? getAssessment(assessmentId) : undefined

  return (
    <AppShell footer={assessment ? <DemoStateSwitcher activeId={assessment.id} /> : null}>
      {!assessment ? (
        <NotFound what={`Assessment “${assessmentId ?? ''}”`} />
      ) : route.name === 'sample' ? (
        <SampleDetailPage assessment={assessment} sampleId={route.sampleId} />
      ) : (
        <AssessmentOverviewPage assessment={assessment} />
      )}
    </AppShell>
  )
}
