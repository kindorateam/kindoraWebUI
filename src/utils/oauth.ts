interface OAuthTokenPayload {
	AccessToken: string
	ExpiresAt: string
	Role: string
}

interface OAuthPopupOptions {
	url: string
	target?: string
	features?: string
	timeoutMs?: number
	allowedOrigins?: string[]
	source?: string
}

const isTokenPayload = (value: unknown): value is OAuthTokenPayload => {
	if (typeof value !== "object" || value === null) {
		return false
	}

	const maybePayload = value as Partial<OAuthTokenPayload>
	return (
		typeof maybePayload.AccessToken === "string" &&
		typeof maybePayload.ExpiresAt === "string" &&
		typeof maybePayload.Role === "string"
	)
}

const defaultFeatures = "popup,width=500,height=650,noopener,noreferrer"

/**
 * Open OAuth popup and wait for backend to postMessage the tokens back
 */
export const openOAuthPopup = async ({
	url,
	target = "kindora-google-oauth",
	features = defaultFeatures,
	timeoutMs = 2 * 60 * 1000,
	allowedOrigins = [],
	source = "kindora-google-oauth",
}: OAuthPopupOptions): Promise<OAuthTokenPayload> => {
	if (typeof window === "undefined") {
		throw new Error("Google OAuth flow is only available in the browser")
	}

	const popup = window.open(url, target, features)
	if (!popup) {
		throw new Error("Popup was blocked. Please allow popups for this site and try again.")
	}

	return new Promise<OAuthTokenPayload>((resolve, reject) => {
		let completed = false

		const cleanup = () => {
			completed = true
			window.removeEventListener("message", handleMessage)
			window.clearInterval(pollInterval)
			window.clearTimeout(timeoutId)
			if (!popup.closed) {
				popup.close()
			}
		}

		const onFailure = (message: string) => {
			if (!completed) {
				cleanup()
				reject(new Error(message))
			}
		}

		const pollInterval = window.setInterval(() => {
			if (popup.closed) {
				onFailure("Google login was cancelled.")
			}
		}, 500)

		const timeoutId = window.setTimeout(() => {
			onFailure("Google login timed out. Please try again.")
		}, timeoutMs)

		const allowedOriginSet = new Set(allowedOrigins.filter(Boolean))

		const handleMessage = (event: MessageEvent) => {
			if (allowedOriginSet.size > 0 && !allowedOriginSet.has(event.origin)) {
				return
			}

			const data = event.data
			if (!data) return

			const dataSource = typeof data === "object" && "source" in data ? (data as { source?: string }).source : null
			if (dataSource && dataSource !== source) {
				return
			}

			const payloadCandidate = typeof data === "object" && "payload" in data ? (data as { payload?: unknown }).payload : data

			if (isTokenPayload(payloadCandidate)) {
				cleanup()
				resolve(payloadCandidate)
				return
			}

			if (typeof data === "object" && "error" in data) {
				const payloadError = (data as { error?: { message?: string } }).error
				const errorMessage = payloadError?.message ?? "Google login failed."
				onFailure(errorMessage)
			}
		}

		window.addEventListener("message", handleMessage)
	})
}
