import { Breadcrumbs as HeroUIBreadcrumbs } from "@heroui/react"
import { Link } from "@tanstack/react-router"
import { memo } from "react"

import usePageMetadata from "@/hooks/usePageMetadata"

import Text from "./Text"

const Breadcrumbs = memo(() => {
	const { breadcrumbs, pageTitle } = usePageMetadata()

	const filteredBreadcrumbs = breadcrumbs.filter((crumb) => crumb.title !== "Home")

	if (breadcrumbs.length === 0) return null

	if (filteredBreadcrumbs.length === 1) {
		return <div className="font-medium text-secondary-strong">{pageTitle}</div>
	}

	return (
		<HeroUIBreadcrumbs separator="/" variant="ghost">
			{filteredBreadcrumbs.map((crumb, index) => (
				<HeroUIBreadcrumbs.Item className="text-base text-neutral-500" key={crumb.path}>
					{index === filteredBreadcrumbs.length - 1 ? (
						<Text color="neutral-600">{crumb.title}</Text>
					) : (
						<Link to={crumb.path}>
							<Text color="neutral-500" weight="medium">
								{crumb.title}
							</Text>
						</Link>
					)}
				</HeroUIBreadcrumbs.Item>
			))}
		</HeroUIBreadcrumbs>
	)
})

Breadcrumbs.displayName = "Breadcrumbs"

export default Breadcrumbs
