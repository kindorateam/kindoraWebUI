import { jwtDecode } from 'jwt-decode'

import type { DecodedGoogleToken, User } from '@/types/auth'

export const decodeJWT = (token: string): DecodedGoogleToken => {
  const decoded = jwtDecode<DecodedGoogleToken>(token)
  if (!decoded) {
    throw new Error('Invalid token format')
  }
  return decoded
}

export const transformGoogleUser = (
  decodedToken: DecodedGoogleToken,
): User => ({
  id: decodedToken.sub,
  email: decodedToken.email,
  name: decodedToken.name,
  picture: decodedToken.picture,
  givenName: decodedToken.given_name,
  familyName: decodedToken.family_name,
})

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token)
    const currentTime = Date.now() / 1000
    const isExpired = decoded.exp < currentTime
    return isExpired
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Auth Debug] Failed to decode token:', error)
    }
    return true
  }
}

export const validateAndDecodeToken = (token: string) => {
  try {
    if (isTokenExpired(token)) {
      return null
    }

    const decodedToken = decodeJWT(token)
    const decodedUser = transformGoogleUser(decodedToken)
    return { decodedToken, decodedUser }
  } catch (error: unknown) {
    if (import.meta.env.DEV) {
      console.error('[Auth Debug] Token validation failed:', error)
    }
    return null // Invalid token
  }
}
