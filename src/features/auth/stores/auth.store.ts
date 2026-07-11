import { atom } from "jotai"
import { RESET, atomWithStorage } from "jotai/utils"

import { appStore } from "@/stores/jotaiStore"

import type { User, UserProfileResponse } from "../types"

export const mapUserResponse = ({ user }: UserProfileResponse): User => ({
	id: user.id,
	email: user.email ?? "",
	name: `${user.firstName} ${user.lastName}`.trim(),
	givenName: user.firstName,
	familyName: user.lastName,
	picture: user.avatar?.path,
})

const userAtom = atom<User | null>(null)

// Remove credentials persisted by older releases without reading them back into application state.
const legacyUserAtom = atomWithStorage<User | null>("auth-user", null)
const legacyTokenAtom = atomWithStorage<string | null>("auth-token", null)

export const authInitializedAtom = atom(false)

const isAuthenticatedAtom = atom((get) => {
	const user = get(userAtom)
	return !!user
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

export const clearAuth = () => {
	appStore.set(userAtom, null)
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
