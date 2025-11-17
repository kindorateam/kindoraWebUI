import { createFileRoute, redirect } from "@tanstack/react-router"

import GuestRoute from "@/components/GuestRoute"

export const Route = createFileRoute("/_auth")({
	component: GuestRoute,
	beforeLoad: ({ context, location }) => {
		// If user is already authenticated, redirect to dashboard
		if (context.auth.isAuthenticated) {
			// If an explicit return URL is present, honor it; otherwise go home
			const href = location.href
			let returnTo: string | undefined

			try {
				const url = new URL(href, window.location.origin)
				const param = url.searchParams.get("redirect")
				if (param && param !== "/login") {
					returnTo = param
				}
			} catch {
				const qIndex = href.indexOf("?")
				if (qIndex >= 0) {
					const sp = new URLSearchParams(href.slice(qIndex))
					const param = sp.get("redirect")
					if (param && param !== "/login") returnTo = param
				}
			}

			if (returnTo) {
				throw redirect({ href: returnTo, replace: true })
			}
			throw redirect({ to: "/dashboard", replace: true })
		}
	},
})
