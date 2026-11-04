import { listAssessments } from '../../data/repository'
import type { Assessment } from '../../schemas'
import { parseHash, paths } from '../../app/routes'

const label = (a: Assessment) =>
  a.overallScore.status === 'scored' ? `Score ${a.overallScore.value}/${a.overallScore.max}` : 'Overall score N/A'

/** Prototype-only control: flips between the scored and N/A assessments (slides 1 and 2). */
export function DemoStateSwitcher({ activeId }: { activeId: string }) {
  const route = parseHash(window.location.hash)
  return (
    <div className="fixed bottom-[68px] right-3 z-30 flex items-center gap-2 rounded-full border border-hairline bg-surface/95 py-1 pl-3 pr-1.5 text-xs shadow-card backdrop-blur md:bottom-4 md:right-4">
      <label htmlFor="demo-state" className="font-medium text-slate">
        Demo data
      </label>
      <select
        id="demo-state"
        value={activeId}
        onChange={(e) => {
          const id = e.target.value
          window.location.hash = route.name === 'sample' ? paths.sample(id, route.sampleId) : paths.overview(id)
        }}
        className="rounded-full border border-hairline bg-canvas px-2 py-1 text-xs font-medium text-ink"
      >
        {listAssessments().map((a) => (
          <option key={a.id} value={a.id}>
            {a.id} · {label(a)}
          </option>
        ))}
      </select>
    </div>
  )
}
