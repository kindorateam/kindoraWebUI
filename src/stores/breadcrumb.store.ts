import { useLocation } from "@tanstack/react-router"
import { atom, useSetAtom } from "jotai"
import { useEffect } from "react"

export const breadcrumbOverridesAtom = atom(new Map<string, string>())

/**
 * Registers a dynamic breadcrumb title for the current route pathname.
 * Cleans up on unmount so stale entries don't linger.
 */
export const useBreadcrumbOverride = (title: string | undefined) => {
	const { pathname } = useLocation()
	const setOverrides = useSetAtom(breadcrumbOverridesAtom)

	useEffect(() => {
		if (!title) return

		setOverrides((prev) => {
			const next = new Map(prev)
			next.set(pathname, title)
			return next
		})

		return () => {
			setOverrides((prev) => {
				const next = new Map(prev)
				next.delete(pathname)
				return next
			})
		}
	}, [pathname, title, setOverrides])
}
