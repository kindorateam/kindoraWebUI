interface OAuthTokenPayload {
	accessToken: string
	expiresAt: string
	role: string
}

interface OAuthPopupOptions {
	url: string
	target?: string
	features?: string
	timeoutMs?: number
	allowedOrigins?: string[]
	source?: string
	popupWindow?: Window | null // Allow passing an already-opened popup
}

const isTokenPayload = (value: unknown): value is OAuthTokenPayload => {
	if (typeof value !== "object" || value === null) {
		return false
	}

	const maybePayload = value as Partial<OAuthTokenPayload>
	return (
		typeof maybePayload.accessToken === "string" &&
		typeof maybePayload.expiresAt === "string" &&
		typeof maybePayload.role === "string"
	)
}

// IMPORTANT: Do NOT include "noopener" - we need window.opener for OAuth postMessage callback
const defaultFeatures = "popup=1,width=500,height=650"

/**
 * Open OAuth popup and wait for backend to postMessage the tokens back
 * If popupWindow is provided, it will use that instead of opening a new one
 */
export const openOAuthPopup = async ({
	url,
	target = "kindora-google-oauth",
	features = defaultFeatures,
	timeoutMs = 2 * 60 * 1000,
	allowedOrigins = [],
	source = "kindora-google-oauth",
	popupWindow,
}: OAuthPopupOptions): Promise<OAuthTokenPayload> => {
	if (typeof window === "undefined") {
		throw new Error("Google OAuth flow is only available in the browser")
	}

	// Use provided popup or open a new one
	const popup = popupWindow || window.open("about:blank", target, features)
	if (!popup) {
		throw new Error("Popup was blocked. Please allow popups for this site and try again.")
	}

	// Navigate the popup to the OAuth URL
	popup.location.href = url

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
			if (import.meta.env.DEV) {
				console.log("[OAuth Popup] Received message from:", event.origin)
				console.log("[OAuth Popup] Message data:", event.data)
				console.log("[OAuth Popup] Allowed origins:", Array.from(allowedOriginSet))
			}

			if (allowedOriginSet.size > 0 && !allowedOriginSet.has(event.origin)) {
				if (import.meta.env.DEV) {
					console.warn("[OAuth Popup] Ignoring message from unauthorized origin:", event.origin)
				}
				return
			}

			const data = event.data
			if (!data) return

			const dataSource = typeof data === "object" && "source" in data ? (data as { source?: string }).source : null
			if (dataSource && dataSource !== source) {
				if (import.meta.env.DEV) {
					console.warn("[OAuth Popup] Ignoring message with wrong source:", dataSource, "expected:", source)
				}
				return
			}

			const payloadCandidate =
				typeof data === "object" && "payload" in data ? (data as { payload?: unknown }).payload : data

			if (isTokenPayload(payloadCandidate)) {
				if (import.meta.env.DEV) {
					console.log("[OAuth Popup] Valid token payload received!")
				}
				cleanup()
				resolve(payloadCandidate)
				return
			}

			if (typeof data === "object" && "error" in data) {
				const payloadError = (data as { error?: { message?: string } }).error
				const errorMessage = payloadError?.message ?? "Google login failed."
				if (import.meta.env.DEV) {
					console.error("[OAuth Popup] Error received:", errorMessage)
				}
				onFailure(errorMessage)
			}
		}

		window.addEventListener("message", handleMessage)
	})
}
