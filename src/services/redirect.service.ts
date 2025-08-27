import { getDefaultStore } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export type RedirectReason = 'unauthorized' | 'expired' | 'invalid'

export interface RedirectOptions {
  reason?: RedirectReason
  returnUrl?: string
  replace?: boolean
}

export interface PendingRedirect {
  url: string
  options?: RedirectOptions
  timestamp: number
}

const pendingRedirectAtom = atomWithReset<PendingRedirect | null>(null)
const store = getDefaultStore()

const getLoginUrl = (options?: RedirectOptions): string => {
  const baseUrl = '/login'

  if (!options?.returnUrl) {
    return baseUrl
  }

  const params = new URLSearchParams({
    returnUrl: options.returnUrl,
    ...(options.reason && { reason: options.reason }),
  })

  return `${baseUrl}?${params.toString()}`
}

export const scheduleRedirectToLogin = (options?: RedirectOptions): void => {
  const returnUrl = options?.returnUrl ?? buildReturnUrl()
  const loginUrl = getLoginUrl({ ...options, returnUrl })

  const pendingRedirect: PendingRedirect = {
    url: loginUrl,
    options: { ...options, returnUrl },
    timestamp: Date.now(),
  }

  store.set(pendingRedirectAtom, pendingRedirect)
}

export const getPendingRedirect = (): PendingRedirect | null => {
  const redirect = store.get(pendingRedirectAtom)

  if (!redirect) return null

  const isExpired = Date.now() - redirect.timestamp > 5000
  if (isExpired) {
    clearPendingRedirect()
    return null
  }

  return redirect
}

export const clearPendingRedirect = (): void => {
  store.set(pendingRedirectAtom, null)
}

export const getReturnUrlFromLocation = (): string | null => {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  return params.get('redirect')
}

export const buildReturnUrl = (): string => {
  if (typeof window === 'undefined') return '/'

  return window.location.pathname + window.location.search
}
