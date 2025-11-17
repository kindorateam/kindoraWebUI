import { useLocation, useNavigate } from "@tanstack/react-router"
import { useAtom, useAtomValue } from "jotai"
import { useCallback } from "react"

import {
	authStateAtom,
	handleEmailLoginAtom,
	handleGoogleLoginAtom,
	handleVerifyFirstLoginAtom,
	logoutAtom,
	updateUserAtom,
} from "@/stores/auth.store"

const useAuth = () => {
	const authState = useAtomValue(authStateAtom)
	const [, handleGoogleLogin] = useAtom(handleGoogleLoginAtom)
	const [, handleEmailLogin] = useAtom(handleEmailLoginAtom)
	const [, handleVerifyFirstLogin] = useAtom(handleVerifyFirstLoginAtom)
	const [, logout] = useAtom(logoutAtom)
	const [, updateUser] = useAtom(updateUserAtom)
	const navigate = useNavigate()
	const location = useLocation()

	const handleLogin = useCallback(async () => {
		try {
			// Open popup IMMEDIATELY and synchronously to avoid popup blocker
			// IMPORTANT: Do NOT use "noopener" - we need window.opener for OAuth postMessage callback
			const popup = window.open("about:blank", "kindora-google-oauth", "popup=1,width=500,height=650")

			if (import.meta.env.DEV) {
				console.log("[useAuth] Popup opened:", !!popup)
			}

			if (!popup) {
				throw new Error("Popup was blocked. Please allow popups for this site and try again.")
			}

			// Pass the already-opened popup to the atom
			await handleGoogleLogin(popup)
			// Note: Navigation is handled by LoginPage's useEffect when isAuthenticated changes
		} catch (error) {
			console.error("[useAuth] Google OAuth failed:", error)
		}
	}, [handleGoogleLogin])

	const handleEmailPasswordLogin = useCallback(
		async (credentials: { email: string; password: string }) => {
			return handleEmailLogin(credentials)
		},
		[handleEmailLogin],
	)

	const handleVerification = useCallback(
		async (email: string, code: string) => {
			return handleVerifyFirstLogin({ email, code })
		},
		[handleVerifyFirstLogin],
	)

	const handleLogout = useCallback(async () => {
		await logout()
	}, [logout])

	interface LogoutOptions {
		preserveReturnUrl?: boolean
		to?: string // defaults to '/login'
		replace?: boolean // defaults to true
	}

	const logoutAndRedirect = useCallback(
		async (opts?: LogoutOptions) => {
			await logout()

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
		handleEmailLogin: handleEmailPasswordLogin,
		handleVerifyFirstLogin: handleVerification,
		logout: handleLogout,
		logoutAndRedirect,
		updateUser,
	}
}

export default useAuth
