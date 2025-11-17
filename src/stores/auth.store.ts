import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { jwtDecode } from "jwt-decode"

import { type UserProfileResponse, fetchUserProfile, login, logout, verifyFirstLogin } from "@/services/auth.service"
import { openOAuthPopup } from "@/utils/oauth"

import type { User } from "@/types/auth"

const mapUserResponse = (data: UserProfileResponse): User => {
	if (data && typeof data === "object" && "user" in data && data.user) {
		return data.user
	}
	return data as User
}

// Atoms for state - using atomWithStorage handles localStorage automatically
export const userAtom = atomWithStorage<User | null>("auth-user", null)
export const tokenAtom = atomWithStorage<string | null>("auth-token", null)
// Note: Refresh token is stored as HttpOnly cookie by backend, not in localStorage

export const isLoadingAtom = atom(true)
export const errorAtom = atom<string | null>(null)
export const authInitializedAtom = atom(false)

const isAuthenticatedAtom = atom((get) => {
	const token = get(tokenAtom)
	const user = get(userAtom)
	// Simply check if both exist - expiration handled by API interceptor
	return !!user && !!token
})

// Token expiration atom
export const tokenExpirationAtom = atom((get) => {
	const token = get(tokenAtom)
	if (!token) return null
	try {
		const decoded = jwtDecode<{ exp?: number }>(token)
		return typeof decoded.exp === "number" ? decoded.exp * 1000 : null
	} catch {
		return null
	}
})

// Derived atoms
export const authStateAtom = atom((get) => ({
	user: get(userAtom),
	isAuthenticated: get(isAuthenticatedAtom),
	isLoading: get(isLoadingAtom),
	error: get(errorAtom),
	isInitialized: get(authInitializedAtom),
}))

const getOAuthStartUrl = (): string => {
	const base = import.meta.env.VITE_API_BASE_URL
	const path = "/auth/oauth/google"

	if (typeof window === "undefined") {
		throw new Error("OAuth flow requires browser environment.")
	}

	if (base && /^https?:\/\//i.test(base)) {
		const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base
		return `${normalizedBase}${path}`
	}

	if (base?.startsWith("/")) {
		const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base
		return `${window.location.origin}${normalizedBase}${path}`
	}

	// Default dev proxy path
	return `${window.location.origin}/api/v1${path}`
}

const getOAuthAllowedOrigins = (): string[] => {
	if (typeof window === "undefined") {
		return []
	}

	const origins = new Set<string>()
	origins.add(window.location.origin)

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
	if (apiBaseUrl?.startsWith("http")) {
		try {
			origins.add(new URL(apiBaseUrl).origin)
		} catch {
			// ignore invalid URL
		}
	}

	const additionalOrigins = import.meta.env.VITE_GOOGLE_OAUTH_ALLOWED_ORIGINS
	if (additionalOrigins) {
		additionalOrigins.split(",").forEach((entry) => {
			try {
				if (entry.trim()) {
					origins.add(new URL(entry.trim()).origin)
				}
			} catch {
				// ignore invalid custom origin
			}
		})
	}

	return Array.from(origins).filter(Boolean)
}

// Action atoms
export const handleGoogleLoginAtom = atom(null, async (_get, set, popupWindow?: Window | null) => {
	// Build URL synchronously before any async operations
	const url = getOAuthStartUrl()
	const allowedOrigins = getOAuthAllowedOrigins()

	try {
		set(isLoadingAtom, true)
		set(errorAtom, null)

		if (import.meta.env.DEV) {
			console.log("[Auth] Starting Google OAuth flow...")
			console.log("[Auth] Popup window provided:", !!popupWindow)
		}

		// Pass the already-opened popup window to avoid popup blocker
		const tokens = await openOAuthPopup({
			url,
			allowedOrigins,
			popupWindow,
		})

		if (import.meta.env.DEV) {
			console.log("[Auth] Received tokens from popup:", { hasAccessToken: !!tokens?.accessToken })
		}

		if (!tokens?.accessToken) {
			throw new Error("Google login did not return an access token.")
		}

		set(tokenAtom, tokens.accessToken)
		if (import.meta.env.DEV) {
			console.log("[Auth] Fetching user profile...")
		}

		const userResponse = await fetchUserProfile()
		const user = mapUserResponse(userResponse)

		if (import.meta.env.DEV) {
			console.log("[Auth] User profile fetched:", user)
		}

		set(userAtom, user)
		set(isLoadingAtom, false)

		if (import.meta.env.DEV) {
			console.log("[Auth] Google OAuth flow complete - user is now authenticated")
		}

		return user
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error("[Auth] Google OAuth failed:", error)
		}
		set(userAtom, null)
		set(tokenAtom, null)
		set(isLoadingAtom, false)
		set(errorAtom, error instanceof Error ? error.message : "Google login failed")
		throw error
	}
})

export const logoutAtom = atom(null, async (_get, set) => {
	try {
		// Call backend to clear HttpOnly refresh token cookie
		await logout()
	} catch (error) {
		// Log error but still clear local state
		if (import.meta.env.DEV) {
			console.error("[auth.store] Logout API call failed:", error)
		}
	} finally {
		// Always clear local state regardless of API call result
		// atomWithStorage handles localStorage automatically
		set(userAtom, null)
		set(tokenAtom, null)
		set(isLoadingAtom, false)
		set(errorAtom, null)
	}
})

export const updateUserAtom = atom(null, (_get, set, user: User) => {
	set(userAtom, user)
})

type LoginResult =
	| { needsVerification: true; email: string; message: string }
	| { needsVerification: false; user: User }

export const handleEmailLoginAtom = atom(
	null,
	async (_get, set, credentials: { email: string; password: string }): Promise<LoginResult> => {
		try {
			set(isLoadingAtom, true)
			set(errorAtom, null)

			// Login - may return tokens or verification required
			const response = await login(credentials)

			// Case 1: New user - verification required
			if ("status" in response && response.status === "verification_required") {
				set(isLoadingAtom, false)
				// Return verification required status to trigger OTP UI
				return { needsVerification: true, email: credentials.email, message: response.message }
			}

			// Case 2: Verified user - tokens received
			// Fetch user profile with the new access token
			const userResponse = await fetchUserProfile()

			// Handle nested user object from backend
			const user = mapUserResponse(userResponse)

			if (import.meta.env.DEV) {
				console.log("[Auth Debug] fetchUserProfile response:", userResponse)
				console.log("[Auth Debug] normalized user:", user)
			}

			// Update user in store
			set(userAtom, user)
			set(isLoadingAtom, false)

			return { needsVerification: false, user }
		} catch (error) {
			set(userAtom, null)
			set(tokenAtom, null)
			set(isLoadingAtom, false)
			set(errorAtom, error instanceof Error ? error.message : "Login failed")
			throw error
		}
	},
)

export const handleVerifyFirstLoginAtom = atom(null, async (_get, set, payload: { email: string; code: string }) => {
	try {
		set(isLoadingAtom, true)
		set(errorAtom, null)

		// Verify OTP and get tokens
		await verifyFirstLogin(payload.email, payload.code)

		// Fetch user profile with the new access token
		const userResponse = await fetchUserProfile()

		// Handle nested user object from backend
		const user = mapUserResponse(userResponse)

		if (import.meta.env.DEV) {
			console.log("[Auth Debug] Verification successful")
			console.log("[Auth Debug] fetchUserProfile response:", userResponse)
			console.log("[Auth Debug] normalized user:", user)
		}

		// Update user in store
		set(userAtom, user)
		set(isLoadingAtom, false)

		return user
	} catch (error) {
		set(userAtom, null)
		set(tokenAtom, null)
		set(isLoadingAtom, false)
		set(errorAtom, error instanceof Error ? error.message : "Verification failed")
		throw error
	}
})

export const checkAuthAtom = atom(null, (get, set) => {
	// Ensure localStorage is synced with atoms before checking
	// atomWithStorage should hydrate synchronously, but double-check
	const storedToken = localStorage.getItem("auth-token")
	const storedUser = localStorage.getItem("auth-user")

	if (import.meta.env.DEV) {
		console.log("[Auth Debug] localStorage - token exists:", !!storedToken)
		console.log("[Auth Debug] localStorage - user exists:", !!storedUser)
	}

	// Get current atom values (should be hydrated from localStorage)
	let token = get(tokenAtom)
	let user = get(userAtom)

	// If atoms are null but localStorage has values, force sync
	if (!token && storedToken && storedToken !== "null") {
		try {
			token = JSON.parse(storedToken)
			set(tokenAtom, token)
		} catch {
			// Invalid token in localStorage, clear it
			localStorage.removeItem("auth-token")
		}
	}

	if (!user && storedUser && storedUser !== "null") {
		try {
			user = JSON.parse(storedUser)
			set(userAtom, user)
		} catch {
			// Invalid user in localStorage, clear it
			localStorage.removeItem("auth-user")
		}
	}

	// Simple check: if we have both token and user, assume logged in
	// Token expiration is handled by API interceptor on actual requests
	const isAuthenticated = !!token && !!user

	if (import.meta.env.DEV) {
		console.log("[Auth Debug] checkAuth - isAuthenticated:", isAuthenticated)
		console.log("[Auth Debug] checkAuth - token:", !!token)
		console.log("[Auth Debug] checkAuth - user:", !!user)
	}

	// Clear orphaned data if inconsistent
	if (token && !user) {
		// Token exists but no user - clear token
		set(tokenAtom, null)
		set(errorAtom, "User data not found")
	} else if (!token && user) {
		// User exists but no token - clear user
		set(userAtom, null)
		set(errorAtom, null)
	} else {
		// Either both exist (logged in) or both null (logged out)
		set(errorAtom, null)
	}

	set(isLoadingAtom, false)
	set(authInitializedAtom, true)
})
