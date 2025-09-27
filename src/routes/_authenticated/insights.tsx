import { createFileRoute } from "@tanstack/react-router"

import PlaceholderPage from "@/components/PlaceholderPage"

export const Route = createFileRoute("/_authenticated/insights")({
	component: () => <PlaceholderPage name="Insights" />,
	beforeLoad: () => {
		return {
			breadcrumb: "Insights",
		}
	},
})
