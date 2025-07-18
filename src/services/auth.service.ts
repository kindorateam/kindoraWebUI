import type { DecodedGoogleToken, User } from '@/types/auth.types'

const TOKEN_KEY = 'auth-token'
const USER_KEY = 'auth-user'

export const decodeJWT = (token: string): DecodedGoogleToken => {
  const base64Url = token.split('.')[1]
  if (!base64Url) {
    throw new Error('Invalid token format')
  }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )
  return JSON.parse(jsonPayload) as DecodedGoogleToken
}

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY)
}

export const logout = (): void => {
  removeToken()
  removeUser()
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
