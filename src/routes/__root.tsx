import { GoogleOAuthProvider } from "@react-oauth/google"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"

import PageLoader from "@/components/PageLoader"

import type { User } from "@/features/auth/types"

export interface RouterContext {
	auth: {
		isAuthenticated: boolean
		user: User | null
	}
}

const RootComponent = () => {
	const { i18n } = useTranslation()

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} locale={i18n.resolvedLanguage}>
			<div>
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
