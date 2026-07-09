const getCurrentHref = (): string => window.location.pathname + window.location.search + window.location.hash

export const getSafeInternalReturnUrl = (
	value: string | null | undefined,
	origin = window.location.origin,
): string | null => {
	if (!value?.startsWith("/") || value.startsWith("//")) return null

	try {
		const url = new URL(value, origin)
		if (url.origin !== origin || url.pathname === "/login") return null

		return `${url.pathname}${url.search}${url.hash}`
	} catch {
		return null
	}
}

export const redirectToLogin = (): void => {
	if (window.location.pathname === "/login") return

	const redirect = encodeURIComponent(getCurrentHref())
	const url = `/login?redirect=${redirect}`

	window.location.replace(url)
}

export const getReturnUrlFromLocation = (): string | null => {
	const params = new URLSearchParams(window.location.search)
	return getSafeInternalReturnUrl(params.get("redirect"))
}
