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
			className="mb-2 inline-flex w-fit items-center gap-2 rounded-xl px-3 py-1.5 font-semibold text-neutral-800 text-sm transition-colors hover:bg-accent-soft hover:text-accent [&.active]:bg-accent-soft [&.active]:text-accent"
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
