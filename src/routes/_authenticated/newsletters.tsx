import { createFileRoute, useNavigate } from "@tanstack/react-router"

import NewslettersPage from "@/features/newsletters/components/NewslettersPage"
import { useTabNavigation } from "@/hooks/useTabNavigation"

type TabType = "sent" | "scheduled" | "drafts"

interface NewslettersSearch {
	tab: TabType
}

function NewslettersLayout() {
	const { tab } = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })
	const handleTabChange = useTabNavigation(tab, "sent", navigate)

	return <NewslettersPage activeTab={tab} onTabChange={handleTabChange} />
}

export const Route = createFileRoute("/_authenticated/newsletters")({
	component: NewslettersLayout,
	validateSearch: (search: Record<string, unknown>): NewslettersSearch => {
		const tab = search.tab as string
		const validTabs: TabType[] = ["sent", "scheduled", "drafts"]

		return {
			tab: validTabs.includes(tab as TabType) ? (tab as TabType) : "sent",
		}
	},
	beforeLoad: () => ({ breadcrumb: "Newsletters" }),
})
