import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

import TablerChevronUp from "~icons/tabler/chevron-up"

import type { NavDrawerItem } from "./navDrawer.types"

interface NavGroupProps {
	item: NavDrawerItem
	isExpanded: boolean
	onToggle: (itemKey: string) => void
}

const NavGroup = ({ item, isExpanded, onToggle }: NavGroupProps) => {
	const { t } = useTranslation()
	const label = t(item.labelKey)
	const controlsId = `group-${item.labelKey.replace(/\W+/g, "-")}`
	const children = item.children?.map((child) => (
		<Link
			activeOptions={{ exact: false }}
			className="w-fit rounded-xl px-3 py-1.5 text-neutral-800 text-sm transition-colors hover:bg-accent-soft hover:text-accent [&.active]:bg-accent-soft [&.active]:text-accent"
			key={child.path}
			to={child.path}
		>
			{t(child.labelKey)}
		</Link>
	))

	const handleToggle = () => {
		onToggle(item.labelKey)
	}

	return (
		<div className="mb-2">
			<button
				aria-controls={controlsId}
				aria-expanded={isExpanded}
				className="inline-flex items-center rounded-xl px-3 py-1.5 font-semibold text-neutral-800 text-sm transition-colors hover:bg-accent-soft hover:text-accent"
				onClick={handleToggle}
				type="button"
			>
				<div className="flex items-center gap-2">
					{item.icon}
					<span>{label}</span>
					<TablerChevronUp
						aria-hidden="true"
						className={clsx("size-4 transition-transform", {
							"rotate-180": !isExpanded,
						})}
					/>
					{item.badge && (
						<span className="ml-auto flex size-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
							{item.badge}
						</span>
					)}
				</div>
			</button>
			{isExpanded && (
				<div className="ms-6 mt-2 flex flex-col" id={controlsId}>
					{children}
				</div>
			)}
		</div>
	)
}

export default NavGroup
