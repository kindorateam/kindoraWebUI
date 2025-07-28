import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import {
  decodeJWT,
  validateAndDecodeToken,
  isTokenExpired,
  transformGoogleUser,
} from '@/utils/auth.utils'

import type { GoogleAuthResponse, User } from '@/types/auth.types'

// Atoms for state - using atomWithStorage handles localStorage automatically
export const userAtom = atomWithStorage<User | null>('auth-user', null)
export const tokenAtom = atomWithStorage<string | null>('auth-token', null)

export const isLoadingAtom = atom(true)
export const errorAtom = atom<string | null>(null)

const isAuthenticatedAtom = atom((get) => {
  const token = get(tokenAtom)
  const user = get(userAtom)
  return !!user && !!token && !isTokenExpired(token)
})

// Token expiration atom
export const tokenExpirationAtom = atom((get) => {
  const token = get(tokenAtom)
  if (!token) return null
  try {
    const { exp } = decodeJWT(token)
    return typeof exp === 'number' ? exp * 1000 : null
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
}))

// Action atoms
export const handleGoogleLoginAtom = atom(
  null,
  (_get, set, response: GoogleAuthResponse) => {
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

export const logoutAtom = atom(null, (_get, set) => {
  // atomWithStorage handles localStorage automatically
  set(userAtom, null)
  set(tokenAtom, null)
  set(isLoadingAtom, false)
  set(errorAtom, null)
})

export const updateUserAtom = atom(null, (_get, set, user: User) => {
  set(userAtom, user)
})

export const checkAuthAtom = atom(null, (get, set) => {
  const token = get(tokenAtom)
  const user = get(userAtom)

  // If we have a token, validate it
  if (!token) {
    if (user) set(userAtom, null)
    set(errorAtom, null)
    set(isLoadingAtom, false) // Important: Set loading to false when no token
  } else {
    const validationResult = validateAndDecodeToken(token)
    if (validationResult) {
      const { decodedUser } = validationResult

      if (!user || user.id !== decodedUser.id) set(userAtom, decodedUser)

      set(errorAtom, null)
    } else {
      set(userAtom, null)
      set(tokenAtom, null)
      set(errorAtom, 'Invalid authentication token')
    }
    set(isLoadingAtom, false)
  }
})
