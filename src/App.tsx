import { getAssessment, listAssessments } from './data/repository'
import { useRoute } from './lib/route'
import { AppShell } from './components/layout/AppShell'
import { DemoSwitcher } from './components/layout/DemoSwitcher'
import { NotFound, SamplePage } from './pages/SamplePage'
import { OverviewPage } from './pages/OverviewPage'

export default function App() {
  const route = useRoute()
  const first = listAssessments()[0]
  const assessmentId = route.name === 'home' ? first?.id : route.assessmentId
  const assessment = assessmentId ? getAssessment(assessmentId) : undefined

  return (
    <AppShell footer={assessment ? <DemoSwitcher activeId={assessment.id} /> : null}>
      {!assessment ? (
        <NotFound what={`Assessment “${assessmentId ?? ''}”`} />
      ) : route.name === 'sample' ? (
        <SamplePage assessment={assessment} sampleId={route.sampleId} />
      ) : (
        <OverviewPage assessment={assessment} />
      )}
    </AppShell>
  )
}
