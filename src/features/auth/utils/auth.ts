import { jwtDecode } from "jwt-decode"

import type { DecodedBackendToken } from "../types"

export const isTokenExpired = (token: string): boolean => {
	try {
		const decoded = jwtDecode<{ exp: number }>(token)
		if (!decoded || !decoded.exp) {
			return true
		}
		const currentTime = Date.now() / 1000
		const isExpired = decoded.exp < currentTime
		return isExpired
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error("[Auth Debug] Failed to decode token:", error)
		}
		return true
	}
}

const isBackendToken = (decoded: unknown): decoded is DecodedBackendToken => {
	return (
		typeof decoded === "object" &&
		decoded !== null &&
		"typ" in decoded &&
		(decoded as DecodedBackendToken).typ === "access_token" &&
		"role" in decoded
	)
}

export const validateAndDecodeToken = (token: string) => {
	try {
		if (isTokenExpired(token)) {
			return null
		}

		const decoded = jwtDecode(token)

		// Handle backend tokens
		if (isBackendToken(decoded)) {
			// Backend tokens don't contain full user info
			// User data is stored separately in userAtom from fetchUserProfile()
			return {
				decodedToken: decoded,
				decodedUser: {
					id: decoded.sub,
					role: decoded.role,
				},
			}
		}

		// Unknown token format
		return null
	} catch (error: unknown) {
		if (import.meta.env.DEV) {
			console.error("[Auth Debug] Token validation failed:", error)
		}
		return null // Invalid token
	}
}
