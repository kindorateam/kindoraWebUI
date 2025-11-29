import { Navigate, createFileRoute } from "@tanstack/react-router"

import RoomActivityTab from "@/features/rooms/components/RoomActivityTab"
import RoomProfileTab from "@/features/rooms/components/RoomProfileTab"
import RoomStudentsTable from "@/features/rooms/components/RoomStudentsTable"

export const Route = createFileRoute("/_authenticated/rooms/$roomId/")({
	component: RoomDetailContent,
})

function RoomDetailContent() {
	const search = Route.useSearch()
	const params = Route.useParams()

	const tab = search.tab
	const roomId = params.roomId

	// Render content based on active tab
	switch (tab) {
		case "students":
			return <RoomStudentsTable roomId={roomId} />
		case "activity":
			return <RoomActivityTab roomId={roomId} />
		case "settings":
			return <RoomProfileTab roomId={roomId} />
		default:
			// Fallback to students tab if invalid tab
			return <Navigate params={{ roomId }} replace search={{ tab: "students" }} to="/rooms/$roomId" />
	}
}
