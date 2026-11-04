import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionHeaderProps {
  /** Id referenced by the parent section's `aria-labelledby`. */
  id: string
  title: string
  subtitle?: ReactNode
  /** Right-aligned control (icon button, tooltip…). */
  action?: ReactNode
  /** `lg` = sample-page cards (15px, regular); `base` = overview cards (14px, medium). */
  size?: 'base' | 'lg'
  className?: string
}

/** Title (+ optional subtitle and action) used at the top of every card. */
export function SectionHeader({ id, title, subtitle, action, size = 'base', className }: SectionHeaderProps) {
  return (
    <header className={cn('flex items-start justify-between gap-2', className)}>
      <div>
        <h2
          id={id}
          className={size === 'lg' ? 'text-lg font-normal text-ink-strong' : 'text-base font-medium text-ink-strong'}
        >
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-ink-strong">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
