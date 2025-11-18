import { apiClient } from "@/services/api.service"
import { appStore } from "@/stores/jotaiStore"

import { tokenAtom } from "../stores/auth.store"

const store = appStore

export const getToken = (): string | null => {
	return store.get(tokenAtom)
}

export const getCleanToken = (): string | null => {
	const token = getToken()
	if (!token) return null

	return sanitizeToken(token)
}

export const clearToken = (): void => {
	store.set(tokenAtom, null)
}

export const setTokens = (accessToken: string): void => {
	store.set(tokenAtom, accessToken)
}

// Track in-flight refresh promise to prevent race conditions
let refreshPromise: Promise<string | null> | null = null

export const refreshAccessToken = async (): Promise<string | null> => {
	// If already refreshing, return the existing promise
	if (refreshPromise) {
		return refreshPromise
	}

	// Create and store the refresh promise
	refreshPromise = (async () => {
		try {
			// Call refresh endpoint
			// Refresh token is sent automatically as HttpOnly cookie by browser
			const response = await apiClient.post<{
				accessToken: string
				expiresAt: string
			}>("/auth/refresh")

			// Store new access token
			// New refresh token is set as HttpOnly cookie by backend
			setTokens(response.accessToken)

			return response.accessToken
		} catch {
			// If refresh fails, clear access token
			// This could be due to: expired refresh token, token reuse, or revoked session
			clearToken()
			return null
		} finally {
			// Clear promise after completion
			refreshPromise = null
		}
	})()

	return refreshPromise
}

const sanitizeToken = (token: string): string => {
	if (!token || typeof token !== "string") {
		throw new Error("Invalid token format")
	}

	let cleanToken = token.trim()

	if (
		(cleanToken.startsWith('"') && cleanToken.endsWith('"')) ||
		(cleanToken.startsWith("'") && cleanToken.endsWith("'"))
	) {
		cleanToken = cleanToken.slice(1, -1)
	}

	if (!isValidJWTFormat(cleanToken)) {
		throw new Error("Token does not match JWT format")
	}

	return cleanToken
}

const isValidJWTFormat = (token: string): boolean => {
	const parts = token.split(".")
	return parts.length === 3 && parts.every((part) => part.length > 0)
}
