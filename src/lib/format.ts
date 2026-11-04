/** Presentation helpers shared by every screen. Pure functions, no React. */

export type ChangeDirection = 'down' | 'up' | 'none'

/** `62.1` → `62.1%` */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

/** `0.942` → `0.942` (always three decimals, like the mockup). */
export function formatConfidence(value: number): string {
  return value.toFixed(3)
}

/** Rounds to one decimal and removes floating-point noise (`-18.100000000000001` → `-18.1`). */
export function roundPp(value: number): number {
  const r = Math.round(value * 10) / 10
  return Object.is(r, -0) ? 0 : r
}

export function changeDirection(deltaPp: number): ChangeDirection {
  const r = roundPp(deltaPp)
  if (r < 0) return 'down'
  if (r > 0) return 'up'
  return 'none'
}

/** `-18.3` → `18.3 pp` (magnitude only; arrow/colour come from the direction). */
export function formatPpMagnitude(deltaPp: number): string {
  return `${Math.abs(roundPp(deltaPp)).toFixed(1)} pp`
}

/** `-18.3` → `↓ 18.3 pp`, `4.7` → `↑ 4.7 pp`, `0` → `No change`. */
export function formatPp(deltaPp: number): string {
  const dir = changeDirection(deltaPp)
  if (dir === 'none') return 'No change'
  return `${dir === 'down' ? '↓' : '↑'} ${formatPpMagnitude(deltaPp)}`
}

/** `"adversarial-manipulation"` stays; used for stable test ids / anchors. */
export function sentenceCase(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
}
