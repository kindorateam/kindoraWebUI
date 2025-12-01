import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { apiClient } from "@/services/api.service"

import { type UserProfileResponse, fetchUserProfile, login, logout, verifyFirstLogin } from "../services/auth.service"

import type { User } from "../types"

const mapUserResponse = (data: UserProfileResponse): User => {
	if (data && typeof data === "object" && "user" in data && data.user) {
		return data.user
	}
	return data as User
}

// Atoms for state - using atomWithStorage handles localStorage automatically
const userAtom = atomWithStorage<User | null>("auth-user", null)
export const tokenAtom = atomWithStorage<string | null>("auth-token", null)
// Note: Refresh token is stored as HttpOnly cookie by backend, not in localStorage

const isLoadingAtom = atom(true)
const errorAtom = atom<string | null>(null)
export const authInitializedAtom = atom(false)

const isAuthenticatedAtom = atom((get) => {
	const token = get(tokenAtom)
	const user = get(userAtom)
	// Simply check if both exist - expiration handled by API interceptor
	return !!user && !!token
})

// Derived atoms
export const authStateAtom = atom((get) => ({
	user: get(userAtom),
	isAuthenticated: get(isAuthenticatedAtom),
	isLoading: get(isLoadingAtom),
	error: get(errorAtom),
	isInitialized: get(authInitializedAtom),
}))

// Action atoms
export const handleGoogleLoginAtom = atom(null, async (_get, set, code: string) => {
	set(isLoadingAtom, true)
	set(errorAtom, null)

	try {
		// Call backend callback endpoint with authorization code
		const response = await apiClient.get<{
			accessToken: string
			expiresAt: string
			role: string
		}>(`/auth/oauth/google/callback?code=${code}`, {
			headers: {
				CustomOrigin: window.location.origin,
			},
		})

		const { accessToken } = response

		// Store access token (refresh token set as HttpOnly cookie by backend)
		set(tokenAtom, accessToken)

		// Fetch user profile
		const userResponse = await fetchUserProfile()
		const user = mapUserResponse(userResponse)

		set(userAtom, user)
		set(isLoadingAtom, false)

		return { success: true }
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error("[Auth] Google OAuth failed:", error)
		}
		set(userAtom, null)
		set(tokenAtom, null)
		set(isLoadingAtom, false)
		const message = error instanceof Error ? error.message : "Google login failed"
		set(errorAtom, message)
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
