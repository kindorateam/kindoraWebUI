import { createFileRoute } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/components/error"
import LoginPage from "@/pages/LoginPage"

export const Route = createFileRoute("/_guest/login")({
	component: () => (
		<RouteErrorBoundary routeName="login">
			<LoginPage />
		</RouteErrorBoundary>
	),
})
