import { Button } from "@heroui/react"
import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

import Logo from "@/assets/svg/kindora.svg?no-inline"
import { navDrawerExpandedItemsAtom, toggleNavDrawerItemAtom } from "@/stores"
import MdiClose from "~icons/mdi/close"

import NavGroup from "./NavGroup"
import NavItem from "./NavItem"
import navDrawerData from "./navDrawer.data.tsx"

interface NavDrawerProps {
	isOpen: boolean
	onClose: () => void
}

const NavDrawer = ({ isOpen, onClose }: NavDrawerProps) => {
	const { t } = useTranslation()
	const [manuallyExpandedItems] = useAtom(navDrawerExpandedItemsAtom)
	const [, toggleExpanded] = useAtom(toggleNavDrawerItemAtom)
	const drawerRef = useRef<HTMLElement>(null)

	useEffect(() => {
		if (!isOpen) return

		drawerRef.current?.focus()
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose()
		}
		window.addEventListener("keydown", handleKeyDown)

		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isOpen, onClose])

	const handleToggleExpanded = (itemKey: string) => {
		toggleExpanded(itemKey)
	}

	const menuItems = navDrawerData.map((item) => {
		const hasChildren = item.children && item.children.length > 0
		const isExpanded = manuallyExpandedItems.includes(item.labelKey)

		if (hasChildren) {
			return (
				<NavGroup
					isExpanded={isExpanded}
					item={item}
					key={item.labelKey}
					onNavigate={onClose}
					onToggle={handleToggleExpanded}
				/>
			)
		}

		return <NavItem item={item} key={item.labelKey} onNavigate={onClose} />
	})

	return (
		<div
			className={clsx(
				"fixed inset-0 z-50 h-dvh lg:relative lg:inset-auto lg:z-auto lg:block",
				isOpen ? "block" : "hidden",
			)}
		>
			<button
				aria-label={t("nav.closeMenu")}
				className="absolute inset-0 bg-black/30 backdrop-blur-[2px] lg:hidden"
				onClick={onClose}
				type="button"
			/>
			<aside
				aria-label={t("nav.primaryAria")}
				className="relative flex h-full w-[min(18rem,86vw)] flex-col bg-white shadow-xl outline-none lg:w-full lg:shadow-lg"
				ref={drawerRef}
				tabIndex={-1}
			>
				<div className="flex items-center justify-between px-4 py-5">
					<Link to="/dashboard" onClick={onClose}>
						<img alt={t("nav.logoAlt")} className="h-8" src={Logo} />
					</Link>
					<Button aria-label={t("nav.closeMenu")} className="lg:hidden" isIconOnly variant="ghost" onPress={onClose}>
						<MdiClose className="size-5" />
					</Button>
				</div>
				<nav aria-label={t("nav.primaryAria")} className="flex-1 overflow-y-auto px-4">
					{menuItems}
				</nav>
			</aside>
		</div>
	)
}

export default NavDrawer
