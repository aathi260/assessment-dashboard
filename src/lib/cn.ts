/** Tiny class-name joiner (keeps the dependency list to what the brief asks for). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
