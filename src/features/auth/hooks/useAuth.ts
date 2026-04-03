import { toast } from "@heroui/react"
import { useGoogleLogin } from "@react-oauth/google"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useAtom, useAtomValue } from "jotai"
import { useEffect } from "react"

import {
	authStateAtom,
	handleEmailLoginAtom,
	handleGoogleLoginAtom,
	handleVerifyFirstLoginAtom,
	logoutAtom,
	updateUserAtom,
} from "../stores/auth.store"

import type { CodeResponse } from "@react-oauth/google"

const useAuth = () => {
	const authState = useAtomValue(authStateAtom)
	const [, handleEmailLogin] = useAtom(handleEmailLoginAtom)
	const [, handleGoogleLoginWithCode] = useAtom(handleGoogleLoginAtom)
	const [, handleVerifyFirstLogin] = useAtom(handleVerifyFirstLoginAtom)
	const [, logout] = useAtom(logoutAtom)
	const [, updateUser] = useAtom(updateUserAtom)
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (authState.error) {
			toast(authState.error, { variant: "danger" })
		}
	}, [authState.error])

	const googleLogin = useGoogleLogin({
		flow: "auth-code",
		ux_mode: "popup",
		redirect_uri: "http://localhost:5173", // Explicitly set redirect_uri
		onSuccess: async (codeResponse: CodeResponse) => {
			try {
				await handleGoogleLoginWithCode(codeResponse.code)
			} catch (error) {
				console.error("Google OAuth failed:", error)
			}
		},
		onError: (error) => {
			console.error("Google OAuth popup failed:", error)
		},
	})

	const handleGoogleLogin = () => {
		googleLogin()
	}

	const handleEmailPasswordLogin = async (credentials: { email: string; password: string }) => {
		return handleEmailLogin(credentials)
	}

	const handleVerification = async (email: string, code: string) => {
		return handleVerifyFirstLogin({ email, code })
	}

	const handleLogout = async () => {
		await logout()
	}

	interface LogoutOptions {
		preserveReturnUrl?: boolean
		to?: string // defaults to '/login'
		replace?: boolean // defaults to true
	}

	const logoutAndRedirect = async (opts?: LogoutOptions) => {
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
	}

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		error: authState.error,
		handleGoogleLogin,
		handleEmailLogin: handleEmailPasswordLogin,
		handleVerifyFirstLogin: handleVerification,
		logout: handleLogout,
		logoutAndRedirect,
		updateUser,
	}
}

export default useAuth
