import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import DeactivateRoomModal from "@/features/rooms/components/DeactivateRoomModal"
import RoomDetailHeader from "@/features/rooms/components/RoomDetailHeader"
import RoomStudentsTable from "@/features/rooms/components/RoomStudentsTable"
import RoomActivityTab from "@/features/rooms/components/RoomTabs/RoomActivityTab"
import RoomProfileTab from "@/features/rooms/components/RoomTabs/RoomProfileTab"
import { useRoom } from "@/features/rooms/hooks/useRooms"
import { getRoomById } from "@/features/rooms/services/room.service"
import { queryClient } from "@/services/queryClient"
import { useBreadcrumbOverride } from "@/stores/breadcrumb.store"

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
	beforeLoad: () => ({ breadcrumb: "Rooms" }),
	loader: ({ params }: { params: { roomId: string } }) => {
		queryClient.ensureQueryData({
			queryKey: ["rooms", params.roomId],
			queryFn: () => getRoomById(params.roomId),
			staleTime: 5 * 60 * 1000,
		})
	},
})

function RoomDetailLayout() {
	const params = Route.useParams()
	const search = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })

	const roomId = params.roomId
	const tab = search.tab
	const { data: room } = useRoom(roomId)
	useBreadcrumbOverride(room?.name)

	const handleTabChange = (newTab: TabType) => {
		void navigate({ search: (prev) => ({ ...prev, tab: newTab }), replace: true })
	}

	const handleDeactivateSuccess = () => {
		void navigate({ to: "/rooms" })
	}

	return (
		<RouteErrorBoundary routeName="room-detail">
			<div>
				<RoomDetailHeader activeTab={tab} onTabChange={handleTabChange} roomId={roomId} />
				<main className="container mx-auto max-w-4xl pt-5">
					{tab === "students" && <RoomStudentsTable roomId={roomId} />}
					{tab === "activity" && <RoomActivityTab roomId={roomId} />}
					{tab === "profile" && <RoomProfileTab roomId={roomId} />}
				</main>
			</div>
			<DeactivateRoomModal onSuccess={handleDeactivateSuccess} />
		</RouteErrorBoundary>
	)
}
