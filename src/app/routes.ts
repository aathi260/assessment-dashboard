import { useEffect, useState } from 'react'

export type Route =
  | { name: 'overview'; assessmentId: string }
  | { name: 'sample'; assessmentId: string; sampleId: string }
  | { name: 'home' }

export const paths = {
  overview: (assessmentId: string) => `#/assessments/${assessmentId}`,
  sample: (assessmentId: string, sampleId: string) => `#/assessments/${assessmentId}/samples/${sampleId}`,
}

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'assessments' && parts[1]) {
    if (parts[2] === 'samples' && parts[3]) return { name: 'sample', assessmentId: parts[1], sampleId: parts[3] }
    return { name: 'overview', assessmentId: parts[1] }
  }
  return { name: 'home' }
}

/** Minimal hash router: back/forward and deep links work without an extra dependency. */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
