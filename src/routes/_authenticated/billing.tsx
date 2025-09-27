import { createFileRoute } from "@tanstack/react-router"

import PlaceholderPage from "@/components/PlaceholderPage"

export const Route = createFileRoute("/_authenticated/billing")({
	component: () => <PlaceholderPage name="Billing" />,
	beforeLoad: () => {
		return {
			breadcrumb: "Billing",
		}
	},
})
