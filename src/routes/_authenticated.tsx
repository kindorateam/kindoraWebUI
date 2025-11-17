import { createFileRoute, redirect } from "@tanstack/react-router"

import MainLayout from "@/components/MainLayout"

export const Route = createFileRoute("/_authenticated")({
	component: MainLayout,
	beforeLoad: ({ context, location }) => {
		// If user is not authenticated, redirect to login
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
				replace: true,
			})
		}
	},
})
