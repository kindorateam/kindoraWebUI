import { Link } from '@tanstack/react-router'
import { memo } from 'react'

import type { NavDrawerItem } from './navDrawer.types'

interface NavItemProps {
  item: NavDrawerItem
}

const baseClasses =
  'mb-2 inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-semibold transition-colors'

const NavItem = memo(({ item }: NavItemProps) => {
  return (
    <Link
      to={item.path}
      activeOptions={{ exact: false }}
      activeProps={{
        className: `${baseClasses} bg-gray-100 text-gray-900 backdrop-opacity-20`,
      }}
      inactiveProps={{
        className: `${baseClasses} text-gray-700 hover:bg-gray-100`,
      }}
    >
      {item.icon}
      <span className="font-medium">{item.label}</span>
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
