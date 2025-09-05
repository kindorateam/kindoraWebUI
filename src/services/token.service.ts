import { getDefaultStore } from 'jotai'

import { apiClient } from './api.service'
import { refreshTokenAtom, tokenAtom } from '@/stores/auth.store'
import { validateAndDecodeToken } from '@/utils/auth'

const store = getDefaultStore()

export const getToken = (): string | null => {
  const token = store.get(tokenAtom)
  if (!token) return null

  const validationResult = validateAndDecodeToken(token)
  if (!validationResult) {
    clearToken()
    return null
  }

  return token
}

export const getCleanToken = (): string | null => {
  const token = getToken()
  if (!token) return null

  return sanitizeToken(token)
}

export const getRefreshToken = (): string | null => {
  return store.get(refreshTokenAtom)
}

export const clearToken = (): void => {
  store.set(tokenAtom, null)
  store.set(refreshTokenAtom, null)
}

export const setTokens = (accessToken: string, refreshToken?: string): void => {
  store.set(tokenAtom, accessToken)
  if (refreshToken) {
    store.set(refreshTokenAtom, refreshToken)
  }
}

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  try {
    // Assuming the refresh endpoint is /auth/refresh
    const response = await apiClient.post<{
      accessToken: string
      refreshToken?: string
    }>('/auth/refresh', { refreshToken })

    const { accessToken, refreshToken: newRefreshToken } = response

    // Update tokens in store
    setTokens(accessToken, newRefreshToken)

    return accessToken
  } catch {
    // If refresh fails, clear all tokens
    clearToken()
    return null
  }
}

const sanitizeToken = (token: string): string => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token format')
  }

  let cleanToken = token.trim()

  if (
    (cleanToken.startsWith('"') && cleanToken.endsWith('"')) ||
    (cleanToken.startsWith("'") && cleanToken.endsWith("'"))
  ) {
    cleanToken = cleanToken.slice(1, -1)
  }

  if (!isValidJWTFormat(cleanToken)) {
    throw new Error('Token does not match JWT format')
  }

  return cleanToken
}

const isValidJWTFormat = (token: string): boolean => {
  const parts = token.split('.')
  return parts.length === 3 && parts.every((part) => part.length > 0)
}
