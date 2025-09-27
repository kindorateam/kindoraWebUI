import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import RoomDetailHeader from "@/components/RoomDetailHeader"
import { useTabNavigation } from "@/hooks/useTabNavigation"
import { getRoomById } from "@/services/room.service"

type TabType = "students" | "activity" | "profile"

interface RoomDetailSearch {
	tab: TabType
}

const roomDetailsFilters = [
	{
		id: "tagsBy",
		label: "Tags by",
		value: "",
		options: [
			{ value: "", label: "All Tags" },
			{ value: "1-10", label: "Fast learner" },
			{ value: "11-20", label: "Loves Drawing" },
			{ value: "21+", label: "Good memory" },
		],
	},
	{
		id: "statusBy",
		label: "Status by",
		value: "",
		options: [
			{ value: "", label: "All" },
			{ value: "active", label: "Active" },
			{ value: "inactive", label: "Inactive" },
		],
	},
]

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
		const room = await getRoomById(params.roomId)
		return {
			breadcrumb: room?.name ?? `Room ${params.roomId}`,
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
				<RoomDetailHeader
					activeTab={tab}
					initialFilters={roomDetailsFilters}
					onTabChange={handleTabChange}
					roomId={roomId}
				/>
				<main className="container max-w-4xl pt-10">
					<Outlet />
				</main>
			</div>
		</RouteErrorBoundary>
	)
}
