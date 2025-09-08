import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { memo, useMemo } from 'react'

import type { NavDrawerItem } from './navDrawer.types'

interface NavGroupProps {
  item: NavDrawerItem
  isExpanded: boolean
  onToggle: (itemLabel: string) => void
}

const baseClasses = 'inline-flex rounded-lg px-4 py-2 text-sm transition-colors'

const NavGroup = memo(({ item, isExpanded, onToggle }: NavGroupProps) => {
  const controlsId = `group-${item.label.replace(/\s+/g, '-')}`
  const children = useMemo(() => {
    return item.children?.map((child) => (
      <Link
        activeOptions={{ exact: false }}
        activeProps={{
          'aria-current': 'page',
          className: clsx(baseClasses, 'bg-brand/20 text-brand'),
        }}
        inactiveProps={{
          className: clsx(
            baseClasses,
            'text-neutral-800 hover:bg-brand/5 hover:text-brand',
          ),
        }}
        key={child.path}
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
        aria-controls={controlsId}
        aria-expanded={isExpanded}
        className="hover:bg-brand/5 hover:text-brand inline-flex w-full items-center rounded-2xl px-4 py-2 text-[15px] font-semibold text-neutral-800 transition-colors"
        onClick={handleToggle}
        type="button"
      >
        <div className="flex items-center gap-2">
          {item.icon}
          <span>{item.label}</span>
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
        <div className="ms-6 mt-1 flex flex-col items-start" id={controlsId}>
          {children}
        </div>
      )}
    </div>
  )
})

NavGroup.displayName = 'NavGroup'

export default NavGroup
