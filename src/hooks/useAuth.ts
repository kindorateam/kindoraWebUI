import { useAtom, useAtomValue } from 'jotai'
import { useCallback } from 'react'

import {
  authStateAtom,
  handleGoogleLoginAtom,
  logoutAtom,
  updateUserAtom,
} from '@/stores/auth.store'

import type { GoogleAuthResponse } from '@/types/auth.types'

export const useAuth = () => {
  const authState = useAtomValue(authStateAtom)
  const [, handleGoogleLogin] = useAtom(handleGoogleLoginAtom)
  const [, logout] = useAtom(logoutAtom)
  const [, updateUser] = useAtom(updateUserAtom)

  const handleLogin = useCallback(
    (response: GoogleAuthResponse) => {
      handleGoogleLogin(response)
    },
    [handleGoogleLogin],
  )

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    handleGoogleLogin: handleLogin,
    logout: handleLogout,
    updateUser,
  }
}
