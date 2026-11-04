import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/** White surface with the deck's hairline outline, radius and soft shadow. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn('rounded-card border border-hairline/60 bg-surface shadow-card', className)} {...rest} />
  )
}
