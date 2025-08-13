import { getDefaultStore } from 'jotai'

import { tokenAtom } from '@/stores/auth.store'
import { validateAndDecodeToken } from '@/utils/auth.utils'

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

export const clearToken = (): void => {
  store.set(tokenAtom, null)
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
