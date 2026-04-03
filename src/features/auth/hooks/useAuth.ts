import { useGoogleLogin } from "@react-oauth/google"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useAtom, useAtomValue } from "jotai"

import { authStateAtom, updateUserAtom } from "../stores/auth.store"

import { useEmailLogin, useGoogleLoginMutation, useLogoutMutation, useVerifyFirstLogin } from "./useAuthMutations"

import type { CodeResponse } from "@react-oauth/google"

interface LogoutOptions {
	preserveReturnUrl?: boolean
	to?: string
	replace?: boolean
}

const useAuth = () => {
	const authState = useAtomValue(authStateAtom)
	const [, updateUser] = useAtom(updateUserAtom)
	const navigate = useNavigate()
	const location = useLocation()

	const emailLoginMutation = useEmailLogin()
	const googleLoginMutation = useGoogleLoginMutation()
	const verifyMutation = useVerifyFirstLogin()
	const logoutMutation = useLogoutMutation()

	const googleLogin = useGoogleLogin({
		flow: "auth-code",
		ux_mode: "popup",
		redirect_uri: "http://localhost:5173",
		onSuccess: (codeResponse: CodeResponse) => {
			googleLoginMutation.mutate(codeResponse.code)
		},
		onError: (error) => {
			console.error("Google OAuth popup failed:", error)
		},
	})

	const logoutAndRedirect = async (opts?: LogoutOptions) => {
		await logoutMutation.mutateAsync()

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

	const isLoading =
		emailLoginMutation.isPending ||
		googleLoginMutation.isPending ||
		verifyMutation.isPending ||
		logoutMutation.isPending

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading,
		emailLoginMutation,
		verifyMutation,
		handleGoogleLogin: googleLogin,
		logout: logoutMutation,
		logoutAndRedirect,
		updateUser,
	}
}

export default useAuth
