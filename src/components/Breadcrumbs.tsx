import { Breadcrumbs as HeroUIBreadcrumbs } from "@heroui/react"
import { Link } from "@tanstack/react-router"

import usePageMetadata from "@/hooks/usePageMetadata"

import Text from "./Text"

interface BreadcrumbsProps {
	inverse?: boolean
}

const Breadcrumbs = ({ inverse = false }: BreadcrumbsProps) => {
	const { breadcrumbs, pageTitle } = usePageMetadata()

	const filteredBreadcrumbs = breadcrumbs.filter((crumb) => crumb.title !== "Home")

	if (breadcrumbs.length === 0) return null

	if (filteredBreadcrumbs.length === 1) {
		return <div className={`font-medium ${inverse ? "text-white" : "text-secondary-strong"}`}>{pageTitle}</div>
	}

	return (
		<HeroUIBreadcrumbs>
			{filteredBreadcrumbs.map((crumb, index) => (
				<HeroUIBreadcrumbs.Item
					className={`text-base ${inverse ? "text-white/80" : "text-neutral-500"}`}
					key={crumb.path}
				>
					{index === filteredBreadcrumbs.length - 1 ? (
						<Text className={inverse ? "text-white" : ""} color="neutral-600">
							{crumb.title}
						</Text>
					) : (
						<Link to={crumb.path}>
							<Text className={inverse ? "text-white" : ""} color="neutral-500" weight="medium">
								{crumb.title}
							</Text>
						</Link>
					)}
				</HeroUIBreadcrumbs.Item>
			))}
		</HeroUIBreadcrumbs>
	)
}

export default Breadcrumbs
