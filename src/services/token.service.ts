import { tokenAtom } from "@/features/auth/stores/auth.store"
import { appStore } from "@/stores/jotaiStore"

import type { DecodedBackendToken } from "@/features/auth/types"

export const getToken = (): string | null => {
	return appStore.get(tokenAtom)
}

export const getCleanToken = (): string | null => {
	const token = getToken()
	if (!token) return null

	try {
		return sanitizeToken(token)
	} catch {
		clearToken()
		return null
	}
}

export const clearToken = (): void => {
	appStore.set(tokenAtom, null)
}

export const setTokens = (accessToken: string): void => {
	appStore.set(tokenAtom, accessToken)
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

export const decodeToken = (token: string): DecodedBackendToken | null => {
	try {
		const cleanToken = sanitizeToken(token)
		const parts = cleanToken.split(".")
		const payload = parts[1]
		if (parts.length !== 3 || !payload) return null

		const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/")
		const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=")
		const decoded = atob(paddedPayload)
		return JSON.parse(decoded) as DecodedBackendToken
	} catch {
		return null
	}
}

export const getCompanyId = (): string | null => {
	const token = getCleanToken()
	if (!token) return null

	const decoded = decodeToken(token)
	return decoded?.cid ?? null
}
