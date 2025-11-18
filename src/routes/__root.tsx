import { GoogleOAuthProvider } from "@react-oauth/google"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Suspense } from "react"

import PageLoader from "@/components/PageLoader"

import type { User } from "@/features/auth/types"

export interface RouterContext {
	auth: {
		isAuthenticated: boolean
		user: User | null
		isLoading: boolean
	}
}

const RootComponent = () => {
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<div className="bg-fade-cream">
				<Suspense fallback={<PageLoader />}>
					<Outlet />
				</Suspense>
				{import.meta.env.DEV && <TanStackRouterDevtools />}
			</div>
		</GoogleOAuthProvider>
	)
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
})
