import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import {
  decodeJWT,
  isTokenExpired,
  transformGoogleUser,
} from '@/services/auth.service'

import type { GoogleAuthResponse, User } from '@/types/auth.types'

// Atoms for state - using atomWithStorage handles localStorage automatically
export const userAtom = atomWithStorage<User | null>('auth-user', null)
export const tokenAtom = atomWithStorage<string | null>('auth-token', null)
export const isLoadingAtom = atom(true)
export const errorAtom = atom<string | null>(null)

// Derived atom for authentication status
export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom)
  const token = get(tokenAtom)
  return !!user && !!token
})

// Derived atoms
export const authStateAtom = atom((get) => ({
  user: get(userAtom),
  isAuthenticated: get(isAuthenticatedAtom),
  isLoading: get(isLoadingAtom),
  error: get(errorAtom),
}))

// Action atoms
export const handleGoogleLoginAtom = atom(
  null,
  (get, set, response: GoogleAuthResponse) => {
    try {
      set(isLoadingAtom, true)
      set(errorAtom, null)

      const decodedToken = decodeJWT(response.credential)
      const user = transformGoogleUser(decodedToken)

      // atomWithStorage handles localStorage automatically
      set(userAtom, user)
      set(tokenAtom, response.credential)
      set(isLoadingAtom, false)
    } catch (error) {
      set(userAtom, null)
      set(tokenAtom, null)
      set(isLoadingAtom, false)
      set(errorAtom, error instanceof Error ? error.message : 'Login failed')
    }
  },
)

export const logoutAtom = atom(null, (get, set) => {
  // atomWithStorage handles localStorage automatically
  set(userAtom, null)
  set(tokenAtom, null)
  set(isLoadingAtom, false)
  set(errorAtom, null)
})

export const updateUserAtom = atom(null, (get, set, user: User) => {
  set(userAtom, user)
})

export const checkAuthAtom = atom(null, (get, set) => {
  // IMPORTANT: Don't clear auth state if we haven't checked localStorage yet
  // atomWithStorage needs time to hydrate from localStorage
  const token = get(tokenAtom)
  const user = get(userAtom)

  // If we have a token, validate it
  if (token) {
    if (!isTokenExpired(token)) {
      try {
        const decodedToken = decodeJWT(token)
        const decodedUser = transformGoogleUser(decodedToken)

        // Verify user matches stored user
        if (!user || user.id !== decodedUser.id) {
          set(userAtom, decodedUser)
        }
        set(isLoadingAtom, false)
      } catch (error) {
        // Token is invalid, clear auth state
        if (import.meta.env.DEV) {
          console.error('[Auth Debug] Token validation failed:', error)
        }
        set(userAtom, null)
        set(tokenAtom, null)
        set(isLoadingAtom, false)
      }
    } else {
      // Token expired
      set(userAtom, null)
      set(tokenAtom, null)
      set(isLoadingAtom, false)
    }
  } else {
    // No token found - set loading to false so the app can proceed
    set(isLoadingAtom, false)
    // Don't clear user/token here - they might just not be loaded yet from localStorage
  }
})
