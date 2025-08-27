import { useLocation } from '@tanstack/react-router'
import { memo, useCallback, useMemo, useState } from 'react'

import navDrawerData from './navDrawer.data.tsx'
import NavGroup from './NavGroup'
import NavItem from './NavItem'
import Logo from '@/assets/svg/logo.svg?no-inline'

import type { NavDrawerItem } from './navDrawer.types'

const NavDrawer = memo(() => {
  const location = useLocation()
  const [manuallyExpandedItems, setManuallyExpandedItems] = useState<string[]>(
    [],
  )

  // Memoize path matching functions to prevent unnecessary re-renders
  const isPathActive = useCallback(
    (path: string): boolean => {
      if (!path || path === '#') return false

      const currentPath = location.pathname

      // Exact match
      if (currentPath === path) return true

      // Handle trailing slashes
      if (currentPath === path + '/' || currentPath + '/' === path) return true

      // Check if current path starts with the given path (for nested routes)
      // Add trailing slash to avoid partial matches (e.g., /room vs /rooms)
      const normalizedPath = path.endsWith('/') ? path : path + '/'
      const normalizedCurrent = currentPath.endsWith('/')
        ? currentPath
        : currentPath + '/'

      return normalizedCurrent.startsWith(normalizedPath)
    },
    [location.pathname],
  )

  // Memoize child checking function
  const hasActiveChild = useCallback(
    (item: NavDrawerItem): boolean => {
      if (!item.children) return false
      return item.children.some((child) => isPathActive(child.path))
    },
    [isPathActive],
  )

  // Calculate automatically expanded items (based on active routes)
  const autoExpandedItems = useMemo(() => {
    const expanded: string[] = []
    navDrawerData.forEach((item) => {
      if (hasActiveChild(item)) {
        expanded.push(item.label)
      }
    })
    return expanded
  }, [hasActiveChild])

  // Combine auto-expanded and manually expanded items
  const expandedItems = useMemo(() => {
    const combined = new Set([...autoExpandedItems, ...manuallyExpandedItems])
    return Array.from(combined)
  }, [autoExpandedItems, manuallyExpandedItems])

  // Toggle function for manual expansion
  const toggleExpanded = useCallback((itemLabel: string) => {
    setManuallyExpandedItems((prev) =>
      prev.includes(itemLabel)
        ? prev.filter((item) => item !== itemLabel)
        : [...prev, itemLabel],
    )
  }, [])

  // Memoize the menu items to prevent unnecessary re-renders
  const menuItems = useMemo(() => {
    return navDrawerData.map((item) => {
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems.includes(item.label)
      const isActive = isPathActive(item.path)

      if (hasChildren) {
        return (
          <NavGroup
            isExpanded={isExpanded}
            isPathActive={isPathActive}
            item={item}
            key={item.label}
            onToggle={toggleExpanded}
          />
        )
      }

      return <NavItem isActive={isActive} item={item} key={item.label} />
    })
  }, [expandedItems, isPathActive, toggleExpanded])

  return (
    <div className="relative h-screen">
      <aside className="flex h-full flex-col bg-white shadow-lg">
        <div className="xl:px-4 xl:py-5">
          <img alt="Kindora Logo" src={Logo} />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">{menuItems}</nav>
      </aside>
    </div>
  )
})

NavDrawer.displayName = 'NavDrawer'

export default NavDrawer
