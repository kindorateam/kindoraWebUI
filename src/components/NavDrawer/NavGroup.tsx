import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { memo, useMemo } from 'react'

import type { NavDrawerItem } from './navDrawer.types'

interface NavGroupProps {
  item: NavDrawerItem
  isExpanded: boolean
  isPathActive: (path: string) => boolean
  onToggle: (itemLabel: string) => void
}

const NavGroup = memo(
  ({ item, isExpanded, isPathActive, onToggle }: NavGroupProps) => {
    const children = useMemo(() => {
      return item.children?.map((child) => (
        <Link
          activeOptions={{ exact: false }}
          activeProps={{
            className:
              'inline-flex rounded-lg px-4 py-2 text-sm transition-colors bg-gray-100 font-medium text-gray-900',
          }}
          inactiveProps={{
            className:
              'inline-flex rounded-lg px-4 py-2 text-sm transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          }}
          key={child.label}
          to={child.path}
        >
          {child.label}
        </Link>
      ))
    }, [item.children])

    const handleToggle = () => {
      onToggle(item.label)
    }

    return (
      <div className="mb-2">
        <button
          className="inline-flex w-full items-center rounded-2xl px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          onClick={handleToggle}
          type="button"
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="font-medium">{item.label}</span>
            <svg
              className={clsx('h-4 w-4 transition-transform', {
                'rotate-180': isExpanded,
              })}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {item.badge && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {item.badge}
              </span>
            )}
          </div>
        </button>
        {isExpanded && (
          <div className="ms-6 mt-1 flex flex-col items-start">{children}</div>
        )}
      </div>
    )
  },
)

NavGroup.displayName = 'NavGroup'

export default NavGroup
