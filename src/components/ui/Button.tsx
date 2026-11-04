import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

const base =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors select-none'
const variants = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-active',
  outline: 'border border-hairline bg-surface text-ink hover:bg-canvas',
} as const

type Variant = keyof typeof variants

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button type="button" className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  )
}
