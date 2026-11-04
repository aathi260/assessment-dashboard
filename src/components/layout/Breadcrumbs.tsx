import { ChevronRightIcon, HomeIcon } from '../icons'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-2xs md:text-xs">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-ink-strong">
        <li className="flex items-center">
          <a href="#/" aria-label="Home" className="inline-flex items-center gap-1 hover:text-coral">
            <HomeIcon size={13} />
            <span>Home</span>
          </a>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRightIcon size={11} className="text-slate" />
            {item.href && i < items.length - 1 ? (
              <a href={item.href} className="hover:text-coral">
                {item.label}
              </a>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
