import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import DeactivateRoomModal from "@/features/rooms/components/DeactivateRoomModal"
import RoomDetailHeader from "@/features/rooms/components/RoomDetailHeader"
import { getRoomById } from "@/features/rooms/services/room.service"
import { useTabNavigation } from "@/hooks/useTabNavigation"
import { queryClient } from "@/services/queryClient"

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
	beforeLoad: async ({ params }: { params: { roomId: string } }) => {
		try {
			const room = await queryClient.fetchQuery({
				queryKey: ["rooms", params.roomId],
				queryFn: () => getRoomById(params.roomId),
				staleTime: 5 * 60 * 1000,
			})
			return {
				breadcrumb: room?.name ?? `Room ${params.roomId}`,
			}
		} catch {
			return {
				breadcrumb: `Room ${params.roomId}`,
			}
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

	const handleDeactivateSuccess = () => {
		void navigate({ to: "/rooms" })
	}

	return (
		<RouteErrorBoundary routeName="room-detail">
			<div>
				<RoomDetailHeader activeTab={tab} onTabChange={handleTabChange} roomId={roomId} />
				<main className="container mx-auto max-w-4xl pt-6">
					<Outlet />
				</main>
			</div>
			<DeactivateRoomModal onSuccess={handleDeactivateSuccess} />
		</RouteErrorBoundary>
	)
}
