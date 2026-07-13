import { atom } from "jotai"
import { RESET, atomWithStorage } from "jotai/utils"

import { appStore } from "@/stores/jotaiStore"

import type { User, UserProfileResponse } from "../types"

export interface AuthCredentials {
	accessToken: string | null
	expiresAt: string | null
	role: string | null
	sessionVersion: string | null
}

export const mapUserResponse = ({ user }: UserProfileResponse): User => ({
	id: user.id,
	email: user.email ?? "",
	name: `${user.firstName} ${user.lastName}`.trim(),
	givenName: user.firstName,
	familyName: user.lastName,
	picture: user.avatar?.path,
})

const userAtom = atom<User | null>(null)
const authCredentialsAtom = atom<AuthCredentials>({
	accessToken: null,
	expiresAt: null,
	role: null,
	sessionVersion: null,
})

// Remove credentials persisted by older releases without reading them back into application state.
const legacyUserAtom = atomWithStorage<User | null>("auth-user", null)
const legacyTokenAtom = atomWithStorage<string | null>("auth-token", null)

export const authInitializedAtom = atom(false)

const isAuthenticatedAtom = atom((get) => {
	const user = get(userAtom)
	const credentials = get(authCredentialsAtom)
	return Boolean(user && credentials.accessToken)
})

// Derived atoms
export const authStateAtom = atom((get) => ({
	user: get(userAtom),
	isAuthenticated: get(isAuthenticatedAtom),
	isInitialized: get(authInitializedAtom),
}))

// Helpers for mutations to update state from outside React
export const setAuthUser = (user: User) => {
	appStore.set(userAtom, user)
}

export const getAuthCredentials = (): AuthCredentials => appStore.get(authCredentialsAtom)

export const setAuthCredentials = ({
	accessToken,
	expiresAt,
	role,
	sessionVersion,
}: {
	accessToken: string
	expiresAt: string
	role: string
	sessionVersion: string
}) => {
	appStore.set(authCredentialsAtom, { accessToken, expiresAt, role, sessionVersion })
}

export const expectAuthSession = (sessionVersion: string) => {
	appStore.set(userAtom, null)
	appStore.set(authCredentialsAtom, { accessToken: null, expiresAt: null, role: null, sessionVersion })
}

export const clearAuth = (expectedSessionVersion?: string | null): boolean => {
	const currentSessionVersion = appStore.get(authCredentialsAtom).sessionVersion
	if (expectedSessionVersion && expectedSessionVersion !== currentSessionVersion) return false

	appStore.set(userAtom, null)
	appStore.set(authCredentialsAtom, { accessToken: null, expiresAt: null, role: null, sessionVersion: null })
	return true
}

export const clearLegacyAuthStorage = () => {
	appStore.set(legacyUserAtom, RESET)
	appStore.set(legacyTokenAtom, RESET)
}

export const setAuthInitialized = () => {
	appStore.set(authInitializedAtom, true)
}

// Action atoms
export const updateUserAtom = atom(null, (_get, set, user: User) => {
	set(userAtom, user)
})
