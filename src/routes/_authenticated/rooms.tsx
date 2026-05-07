import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/rooms")({
	component: Outlet,
	beforeLoad: () => ({ breadcrumbKey: "rooms.title" }),
})
