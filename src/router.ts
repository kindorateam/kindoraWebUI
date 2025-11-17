import { createRouter } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"

import type { RouterContext } from "./routes/__root"

export const router = createRouter({
	routeTree,
	context: {
		auth: undefined!,
	},
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
