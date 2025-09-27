import { useLocation, useNavigate } from "@tanstack/react-router"
import { useAtom, useAtomValue } from "jotai"
import { useCallback } from "react"

import { authStateAtom, handleGoogleLoginAtom, logoutAtom, updateUserAtom } from "@/stores/auth.store"

import type { GoogleAuthResponse } from "@/types/auth"

const useAuth = () => {
	const authState = useAtomValue(authStateAtom)
	const [, handleGoogleLogin] = useAtom(handleGoogleLoginAtom)
	const [, logout] = useAtom(logoutAtom)
	const [, updateUser] = useAtom(updateUserAtom)
	const navigate = useNavigate()
	const location = useLocation()

	const handleLogin = useCallback(
		(response: GoogleAuthResponse) => {
			handleGoogleLogin(response)
		},
		[handleGoogleLogin],
	)

	const handleLogout = useCallback(() => {
		logout()
	}, [logout])

	interface LogoutOptions {
		preserveReturnUrl?: boolean
		to?: string // defaults to '/login'
		replace?: boolean // defaults to true
	}

	const logoutAndRedirect = useCallback(
		(opts?: LogoutOptions) => {
			logout()

			const replace = opts?.replace ?? true
			const baseTo = opts?.to ?? "/login"

			if (opts?.preserveReturnUrl) {
				const href = location.href
				const next = `${baseTo}?redirect=${encodeURIComponent(href)}`
				void navigate({ href: next, replace })
				return
			}

			void navigate({ to: baseTo, replace })
		},
		[logout, navigate, location.href],
	)

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		error: authState.error,
		handleGoogleLogin: handleLogin,
		logout: handleLogout,
		logoutAndRedirect,
		updateUser,
	}
}

export default useAuth
