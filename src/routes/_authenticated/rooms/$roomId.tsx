import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import RoomDetailHeader from "@/features/rooms/components/RoomDetailHeader"
import { useTabNavigation } from "@/hooks/useTabNavigation"

type TabType = "students" | "activity" | "profile"

interface RoomDetailSearch {
	tab: TabType
}

export const Route = createFileRoute("/_authenticated/rooms/$roomId")({
	component: RoomDetailLayout,
	parseParams: (params) => ({
		roomId: params.roomId,
	}),
	validateSearch: (search: Record<string, unknown>): RoomDetailSearch => {
		const tab = search.tab as string
		const validTabs: TabType[] = ["students", "activity", "profile"]

		return {
			tab: validTabs.includes(tab as TabType) ? (tab as TabType) : "students",
		}
	},
})

function RoomDetailLayout() {
	const params = Route.useParams()
	const search = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })

	const roomId = params.roomId
	const tab = search.tab

	const handleTabChange = useTabNavigation(tab, "students", navigate)

	return (
		<RouteErrorBoundary routeName="room-detail">
			<div>
				<RoomDetailHeader activeTab={tab} onTabChange={handleTabChange} roomId={roomId} />
				<main className="container max-w-4xl pt-10">
					<Outlet />
				</main>
			</div>
		</RouteErrorBoundary>
	)
}
