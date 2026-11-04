import type { ReactNode } from 'react'
import { imageSrc } from '../../assets/images/registry'
import { cn } from '../../lib/cn'
import { CubeIcon, GridIcon, LogoutIcon, ReportIcon } from '../icons'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: GridIcon, active: true },
  { label: 'Reports', icon: ReportIcon, active: false },
] as const

/** One nav control, shared by the desktop rail and the mobile bar. */
function NavButton({
  label,
  icon: Icon,
  active = false,
  href,
}: {
  label: string
  icon: typeof GridIcon
  active?: boolean
  href?: string
}) {
  const className = cn(
    'grid size-10 place-items-center rounded-xl text-ink-strong hover:bg-canvas',
    active && 'bg-canvas',
  )
  return href ? (
    <a href={href} aria-label={label} aria-current={active ? 'page' : undefined} className={className}>
      <Icon size={22} />
    </a>
  ) : (
    <button type="button" aria-label={label} className={className}>
      <Icon size={22} />
    </button>
  )
}

function NavItems() {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <NavButton key={item.label} href="#/" {...item} />
      ))}
    </>
  )
}

/** Header + icon rail (≥ md) / bottom bar (< md) around the page content. */
export function AppShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="fixed inset-x-0 top-0 z-20 flex h-[66px] items-center justify-between bg-surface px-4 md:px-[18px]">
        <a href="#/" aria-label="Home" className="grid size-9 place-items-center rounded-lg text-ink-strong">
          <CubeIcon size={26} />
        </a>
        <div className="flex items-center gap-4">
          <span className="text-base">Workspace</span>
          <span className="h-[31px] w-px bg-divider" aria-hidden="true" />
          <img src={imageSrc('avatar')} alt="Signed-in user" className="size-[33px] rounded-full" />
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="fixed bottom-0 left-0 top-[66px] z-10 hidden w-16 flex-col items-center justify-between bg-surface pb-5 md:flex"
      >
        <div className="mt-5 flex flex-col gap-3">
          <NavItems />
        </div>
        <NavButton label="Sign out" icon={LogoutIcon} />
      </nav>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 flex h-14 items-center justify-around border-t border-divider bg-surface md:hidden"
      >
        <NavItems />
        <NavButton label="Sign out" icon={LogoutIcon} />
      </nav>

      <main className="px-4 pb-24 pt-[81px] md:pb-10 md:pl-[82px] md:pr-[27px]">{children}</main>
      {footer}
    </div>
  )
}
