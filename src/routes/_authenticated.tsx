import { createFileRoute, redirect } from "@tanstack/react-router"

import MainLayout from "@/components/MainLayout"
import { getToken } from "@/services/token.service"

export const Route = createFileRoute("/_authenticated")({
	component: MainLayout,
	beforeLoad: ({ location }) => {
		const token = getToken()
		if (!token) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
				replace: true,
			})
		}
	},
})
