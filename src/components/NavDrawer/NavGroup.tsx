import { Link } from "@tanstack/react-router"
import clsx from "clsx"

import TablerChevronUp from "~icons/tabler/chevron-up"

import type { NavDrawerItem } from "./navDrawer.types"

interface NavGroupProps {
	item: NavDrawerItem
	isExpanded: boolean
	onToggle: (itemLabel: string) => void
}

const NavGroup = ({ item, isExpanded, onToggle }: NavGroupProps) => {
	const controlsId = `group-${item.label.replace(/\s+/g, "-")}`
	const children = item.children?.map((child) => (
		<Link
			activeOptions={{ exact: false }}
			className="flex rounded-[14px] px-4 py-2 text-neutral-800 text-sm transition-colors hover:bg-rose-50 hover:text-rose-600 [&.active]:bg-rose-100 [&.active]:text-rose-600"
			key={child.path}
			to={child.path}
		>
			{child.label}
		</Link>
	))

	const handleToggle = () => {
		onToggle(item.label)
	}

	return (
		<div className="mb-2">
			<button
				aria-controls={controlsId}
				aria-expanded={isExpanded}
				className="flex w-full items-center rounded-2xl px-4 py-2 font-semibold text-neutral-800 text-sm transition-colors hover:bg-rose-50 hover:text-rose-600"
				onClick={handleToggle}
				type="button"
			>
				<div className="flex items-center gap-2">
					{item.icon}
					<span>{item.label}</span>
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
