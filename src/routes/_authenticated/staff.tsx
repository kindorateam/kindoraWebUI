import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/staff")({
	component: Outlet,
	beforeLoad: () => {
		return {
			breadcrumb: "Staff",
		}
	},
})
