import type { ModelOutputType } from '../../schemas'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { DownloadIcon, InfoIcon } from '../icons'

const outputLabel: Record<ModelOutputType, string> = { image: 'Image', text: 'Text', audio: 'Audio', video: 'Video' }

export function PageHeader({
  title,
  outputType,
  onDownload,
  className,
}: {
  title: string
  outputType: ModelOutputType
  onDownload: () => void
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3', className)}>
      <h1 className="text-xl font-normal leading-tight text-ink-strong sm:text-title">{title}</h1>
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-8 items-center gap-2 rounded-full border border-hairline bg-surface px-4 text-sm font-normal text-ink"
          title="Model output type"
        >
          {outputLabel[outputType]}
          <InfoIcon size={12} aria-hidden="true" />
          <span className="sr-only">model output type</span>
        </span>
        <Button onClick={onDownload}>
          <DownloadIcon size={13} />
          Download Report
        </Button>
      </div>
    </div>
  )
}
