import { Spinner } from "@heroui/react"
import { createRouter } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"

import type { RouterContext } from "./routes/__root"

export const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultPendingMs: 150,
	defaultPendingMinMs: 300,
	defaultPendingComponent: () => (
		<div className="flex h-full items-center justify-center py-20">
			<Spinner />
		</div>
	),
	context: {
		auth: {
			isAuthenticated: false,
			user: null,
		},
	} satisfies RouterContext,
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
