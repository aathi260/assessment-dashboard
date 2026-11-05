import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SelectableCardProps {
  /** Radio group name; cards sharing a name behave as one native radio group (arrow keys, tab stop). */
  name: string
  checked: boolean
  onSelect?: () => void
  ariaLabel?: string
  className?: string
  children: ReactNode
}

/**
 * A card that is really a radio input: native keyboard behaviour, green selected ring from the deck,
 * and a visible focus ring. Used for category cards and assessed-input thumbnails.
 */
export function SelectableCard({ name, checked, onSelect, ariaLabel, className, children }: SelectableCardProps) {
  const Element = onSelect ? 'label' : 'div'
  return (
    <Element
      className={cn(
        'relative block rounded-xl border transition-shadow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-coral',
        onSelect && 'cursor-pointer',
        checked ? 'border-select-ring bg-select-fill shadow-select' : 'border-hairline bg-surface hover:shadow-card',
        className,
      )}
    >
      {onSelect && (
        <input
          type="radio"
          name={name}
          className="sr-only"
          checked={checked}
          onChange={onSelect}
          aria-label={ariaLabel}
        />
      )}
      {children}
    </Element>
  )
}
