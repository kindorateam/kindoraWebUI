import { useLocation, useNavigate } from "@tanstack/react-router"
import { useAtom, useAtomValue } from "jotai"

import { authStateAtom, updateUserAtom } from "../stores/auth.store"

import { useEmailLogin, useLogoutMutation, useVerifyFirstLogin } from "./useAuthMutations"

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
	const verifyMutation = useVerifyFirstLogin()
	const logoutMutation = useLogoutMutation()

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

	const isLoading = emailLoginMutation.isPending || verifyMutation.isPending || logoutMutation.isPending

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading,
		emailLoginMutation,
		verifyMutation,
		logout: logoutMutation,
		logoutAndRedirect,
		updateUser,
	}
}

export default useAuth
