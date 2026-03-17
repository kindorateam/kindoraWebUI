import { createFileRoute } from "@tanstack/react-router"

import RoomsPage from "@/features/rooms/components/RoomsPage"

export const Route = createFileRoute("/_authenticated/rooms/")({
	component: RoomsPage,
})
