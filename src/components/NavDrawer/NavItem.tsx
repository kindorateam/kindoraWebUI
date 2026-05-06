import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import type { NavDrawerItem } from "./navDrawer.types"

interface NavItemProps {
	item: NavDrawerItem
}

const NavItem = ({ item }: NavItemProps) => {
	const { t } = useTranslation()
	const label = t(item.labelKey)

	return (
		<Link
			activeOptions={{ exact: false }}
			className="mb-2 inline-flex w-fit items-center gap-2 rounded-xl px-3 py-1.5 font-semibold text-neutral-800 text-sm transition-colors hover:bg-accent-soft hover:text-accent [&.active]:bg-accent-soft [&.active]:text-accent"
			to={item.path}
		>
			{item.icon}
			<span>{label}</span>
			{item.badge && (
				<span className="ml-auto flex size-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
					{item.badge}
				</span>
			)}
		</Link>
	)
}

export default NavItem
