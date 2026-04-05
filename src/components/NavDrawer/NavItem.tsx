import { Link } from "@tanstack/react-router"
import { memo } from "react"

import type { NavDrawerItem } from "./navDrawer.types"

interface NavItemProps {
	item: NavDrawerItem
}

const NavItem = memo(({ item }: NavItemProps) => {
	return (
		<Link
			activeOptions={{ exact: false }}
			className="mb-2 flex items-center gap-2 rounded-2xl px-4 py-2 font-semibold text-neutral-800 text-sm transition-colors hover:bg-rose-50 hover:text-rose-600 [&.active]:bg-rose-100 [&.active]:text-rose-600"
			to={item.path}
		>
			{item.icon}
			<span>{item.label}</span>
			{item.badge && (
				<span className="ml-auto flex size-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
					{item.badge}
				</span>
			)}
		</Link>
	)
})

NavItem.displayName = "NavItem"

export default NavItem
