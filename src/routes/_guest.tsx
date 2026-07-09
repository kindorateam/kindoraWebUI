import { createFileRoute, redirect } from "@tanstack/react-router"

import GuestRoute from "@/components/GuestRoute"
import { getSafeInternalReturnUrl } from "@/services/redirect.service"

export const Route = createFileRoute("/_guest")({
	component: GuestRoute,
	beforeLoad: ({ context, location }) => {
		// If user is already authenticated, redirect to dashboard
		if (context.auth.isAuthenticated) {
			// If an explicit return URL is present, honor it; otherwise go home
			const href = location.href
			let returnTo: string | undefined

			try {
				const url = new URL(href, window.location.origin)
				returnTo = getSafeInternalReturnUrl(url.searchParams.get("redirect")) ?? undefined
			} catch {
				const qIndex = href.indexOf("?")
				if (qIndex >= 0) {
					const sp = new URLSearchParams(href.slice(qIndex))
					returnTo = getSafeInternalReturnUrl(sp.get("redirect")) ?? undefined
				}
			}

			if (returnTo) {
				throw redirect({ href: returnTo, replace: true })
			}
			throw redirect({ to: "/dashboard", replace: true })
		}
	},
})
