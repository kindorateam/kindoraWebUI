import { useRouterState } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { memo, useCallback, useMemo } from 'react'

import navDrawerData from './navDrawer.data.tsx'
import NavGroup from './NavGroup'
import NavItem from './NavItem'
import Logo from '@/assets/svg/logo.svg?no-inline'
import { navDrawerExpandedItemsAtom, toggleNavDrawerItemAtom } from '@/stores'

import type { NavDrawerItem } from './navDrawer.types'

const NavDrawer = memo(() => {
  const matches = useRouterState({ select: (s) => s.matches })
  const [manuallyExpandedItems] = useAtom(navDrawerExpandedItemsAtom)
  const [, toggleExpanded] = useAtom(toggleNavDrawerItemAtom)

  const isPathActive = useCallback(
    (path: string) =>
      matches.some(
        (m) => m.pathname === path || m.pathname.startsWith(path + '/'),
      ),
    [matches],
  )

  const hasActiveChild = useCallback(
    (item: NavDrawerItem): boolean => {
      if (!item.children) return false
      return item.children.some((child) => isPathActive(child.path))
    },
    [isPathActive],
  )

  const autoExpandedItems = useMemo(
    () => navDrawerData.filter(hasActiveChild).map((i) => i.label),
    [hasActiveChild],
  )

  const expandedItems = useMemo(() => {
    const combined = new Set([...autoExpandedItems, ...manuallyExpandedItems])
    return Array.from(combined)
  }, [autoExpandedItems, manuallyExpandedItems])

  const handleToggleExpanded = useCallback(
    (itemLabel: string) => {
      toggleExpanded(itemLabel)
    },
    [toggleExpanded],
  )

  const menuItems = useMemo(() => {
    return navDrawerData.map((item) => {
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems.includes(item.label)

      if (hasChildren) {
        return (
          <NavGroup
            isExpanded={isExpanded}
            item={item}
            key={item.label}
            onToggle={handleToggleExpanded}
          />
        )
      }

      return <NavItem item={item} key={item.label} />
    })
  }, [expandedItems, handleToggleExpanded])

  return (
    <div className="relative h-screen">
      <aside className="flex h-full flex-col bg-white shadow-lg">
        <div className="xl:px-4 xl:py-5">
          <img alt="Kindora Logo" src={Logo} />
        </div>

        <nav className="flex-1 overflow-y-auto p-4" role="navigation">
          {menuItems}
        </nav>
      </aside>
    </div>
  )
})

NavDrawer.displayName = 'NavDrawer'

export default NavDrawer
