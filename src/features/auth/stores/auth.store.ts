import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

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

// Atoms for state - using atomWithStorage handles localStorage automatically
const userAtom = atomWithStorage<User | null>("auth-user", null, undefined, {
	getOnInit: true,
})
export const tokenAtom = atomWithStorage<string | null>("auth-token", null, undefined, {
	getOnInit: true,
})
// Note: Refresh token is stored as HttpOnly cookie by backend, not in localStorage

export const authInitializedAtom = atom(false)

const isAuthenticatedAtom = atom((get) => {
	const token = get(tokenAtom)
	const user = get(userAtom)
	return !!user && !!token
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
	appStore.set(tokenAtom, null)
}

// Action atoms
export const updateUserAtom = atom(null, (_get, set, user: User) => {
	set(userAtom, user)
})

export const checkAuthAtom = atom(null, (get, set) => {
	const token = get(tokenAtom)
	const user = get(userAtom)

	if (token && !user) {
		set(tokenAtom, null)
	} else if (!token && user) {
		set(userAtom, null)
	}

	set(authInitializedAtom, true)
})
