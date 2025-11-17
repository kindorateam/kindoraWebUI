import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Suspense } from "react"

import PageLoader from "@/components/PageLoader"

import type { User } from "@/types/auth"

export interface RouterContext {
	auth: {
		isAuthenticated: boolean
		user: User | null
		isLoading: boolean
	}
}

const RootComponent = () => {
	return (
		<div className="bg-fade-cream">
			<Suspense fallback={<PageLoader />}>
				<Outlet />
			</Suspense>
			{import.meta.env.DEV && <TanStackRouterDevtools />}
		</div>
	)
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
})
