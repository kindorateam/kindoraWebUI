import { Link } from '@tanstack/react-router'
import { memo } from 'react'

import type { NavDrawerItem } from './navDrawer.types'

interface NavItemProps {
  item: NavDrawerItem
}

const baseClasses =
  'mb-2 flex items-center gap-2 rounded-2xl px-4 py-2 text-[15px] font-semibold transition-colors'

const NavItem = memo(({ item }: NavItemProps) => {
  return (
    <Link
      activeOptions={{ exact: false }}
      activeProps={{
        'aria-current': 'page',
        className: `${baseClasses} bg-brand/20 text-brand`,
      }}
      inactiveProps={{
        className: `${baseClasses} text-neutral-800 hover:bg-brand/5 hover:text-brand`,
      }}
      to={item.path}
    >
      {item.icon}
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {item.badge}
        </span>
      )}
    </Link>
  )
})

NavItem.displayName = 'NavItem'

export default NavItem
