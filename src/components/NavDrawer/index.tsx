import { Link, useRouterState } from "@tanstack/react-router"
import { useAtom } from "jotai"

import Logo from "@/assets/svg/kindora.svg?no-inline"
import { navDrawerExpandedItemsAtom, toggleNavDrawerItemAtom } from "@/stores"

import NavGroup from "./NavGroup"
import NavItem from "./NavItem"
import navDrawerData from "./navDrawer.data.tsx"

import type { NavDrawerItem } from "./navDrawer.types"

const NavDrawer = () => {
	const matches = useRouterState({ select: (s) => s.matches })
	const [manuallyExpandedItems] = useAtom(navDrawerExpandedItemsAtom)
	const [, toggleExpanded] = useAtom(toggleNavDrawerItemAtom)

	const isPathActive = (path: string) => matches.some((m) => m.pathname === path || m.pathname.startsWith(`${path}/`))

	const hasActiveChild = (item: NavDrawerItem): boolean => {
		if (!item.children) return false
		return item.children.some((child) => isPathActive(child.path))
	}

	const autoExpandedItems = navDrawerData.filter(hasActiveChild).map((i) => i.label)

	const combined = new Set([...autoExpandedItems, ...manuallyExpandedItems])
	const expandedItems = Array.from(combined)

	const handleToggleExpanded = (itemLabel: string) => {
		toggleExpanded(itemLabel)
	}

	const menuItems = navDrawerData.map((item) => {
		const hasChildren = item.children && item.children.length > 0
		const isExpanded = expandedItems.includes(item.label)

		if (hasChildren) {
			return <NavGroup isExpanded={isExpanded} item={item} key={item.label} onToggle={handleToggleExpanded} />
		}

		return <NavItem item={item} key={item.label} />
	})

	return (
		<div className="relative h-screen">
			<aside className="flex h-full flex-col bg-white shadow-lg">
				<div className="px-4 py-5">
					<Link to="/dashboard">
						<img alt="Kindora Logo" className="h-8" src={Logo} />
					</Link>
				</div>
				<nav aria-label="Primary" className="flex-1 overflow-y-auto">
					{menuItems}
				</nav>
			</aside>
		</div>
	)
}

export default NavDrawer
