import { useGoogleLogin } from "@react-oauth/google"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"

import { createGoogleOAuthState } from "../services/auth.service"
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
	const [googleState, setGoogleState] = useState<string>()
	const [isPreparingGoogle, setIsPreparingGoogle] = useState(false)

	const googleLogin = useGoogleLogin({
		flow: "auth-code",
		ux_mode: "popup",
		state: googleState,
		redirect_uri: window.location.origin,
		onSuccess: (codeResponse: CodeResponse) => {
			if (!codeResponse.state) return
			googleLoginMutation.mutate({ code: codeResponse.code, state: codeResponse.state })
		},
		onError: (error) => {
			console.error("Google OAuth popup failed:", error)
		},
	})

	useEffect(() => {
		if (!googleState) return
		googleLogin()
		setGoogleState(undefined)
	}, [googleLogin, googleState])

	const prepareGoogleLogin = async () => {
		setIsPreparingGoogle(true)
		try {
			const { state } = await createGoogleOAuthState()
			setGoogleState(state)
		} catch (error) {
			console.error("Google OAuth initialization failed:", error)
		} finally {
			setIsPreparingGoogle(false)
		}
	}

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
		logoutMutation.isPending ||
		isPreparingGoogle

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading,
		emailLoginMutation,
		verifyMutation,
		handleGoogleLogin: () => void prepareGoogleLogin(),
		logout: logoutMutation,
		logoutAndRedirect,
		updateUser,
	}
}

export default useAuth
