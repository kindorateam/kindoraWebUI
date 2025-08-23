import { Link, useLocation } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'

import navDrawerData from './navDrawer.data.tsx'
import Logo from '@/assets/svg/logo.svg?no-inline'

import type { NavDrawerItem } from './navDrawer.types'

const NavDrawer = () => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Check if any child of a menu item is active
  const hasActiveChild = useCallback(
    (item: NavDrawerItem): boolean => {
      if (!item.children) return false
      return item.children.some((child) => location.pathname === child.path)
    },
    [location.pathname],
  )

  // Auto-expand parent if child is active
  useEffect(() => {
    const expanded: string[] = []
    navDrawerData.forEach((item) => {
      if (hasActiveChild(item)) {
        expanded.push(item.label)
      }
    })
    if (expanded.length > 0) {
      setExpandedItems(expanded)
    }
  }, [hasActiveChild])

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemLabel)
        ? prev.filter((item) => item !== itemLabel)
        : [...prev, itemLabel],
    )
  }

  const renderMenuItem = (item: NavDrawerItem) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.label)
    const isActive = location.pathname === item.path
    const isParentActive = hasActiveChild(item)

    if (hasChildren) {
      return (
        <div className="mb-2" key={item.label}>
          <button
            className={`inline-flex items-center rounded-2xl px-4 py-2 transition-colors ${
              isParentActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => toggleExpanded(item.label)}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="font-medium">{item.label}</span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
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
              {item.badge && item.badge}
            </div>
          </button>
          {isExpanded && (
            <div className="ms-6 mt-1 flex flex-col items-start">
              {item.children?.map((child) => {
                const isChildActive = location.pathname === child.path
                return (
                  <Link
                    className={`inline-flex rounded-lg px-4 py-2 text-sm transition-colors ${
                      isChildActive
                        ? 'bg-gray-100 font-medium text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    key={child.label}
                    to={child.path}
                  >
                    {child.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        className={`mb-2 inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-semibold transition-colors ${
          isActive
            ? 'bg-gray-100 text-gray-900 backdrop-opacity-20'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        key={item.label}
        to={item.path}
      >
        {item.icon}
        <span className="font-medium">{item.label}</span>
        {item.badge && item.badge}
      </Link>
    )
  }

  return (
    <div className="relative h-screen">
      <aside className="flex h-full flex-col bg-white shadow-lg">
        <div className="xl:px-4 xl:py-5">
          <img alt="Kindora Logo" src={Logo} />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navDrawerData.map(renderMenuItem)}
        </nav>
      </aside>
    </div>
  )
}

export default NavDrawer
