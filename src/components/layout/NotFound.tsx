import { paths } from '../../app/routes'

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
