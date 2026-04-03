import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/services/api.service"

import {
	fetchUserProfile,
	login,
	logout as logoutService,
	requestPasswordReset,
	resetPassword,
	verifyFirstLogin,
	verifyPasswordResetOTP,
} from "../services/auth.service"
import { clearAuth, mapUserResponse, setAuthUser } from "../stores/auth.store"

import type { LoginResult } from "../types"

export const useEmailLogin = () => {
	return useMutation({
		mutationFn: async (credentials: { email: string; password: string }): Promise<LoginResult> => {
			const response = await login(credentials)

			if ("status" in response && response.status === "verification_required") {
				return { needsVerification: true, email: credentials.email, message: response.message }
			}

			const userResponse = await fetchUserProfile()
			const user = mapUserResponse(userResponse)
			setAuthUser(user)

			return { needsVerification: false, user }
		},
		onError: () => {
			clearAuth()
		},
	})
}

export const useGoogleLoginMutation = () => {
	return useMutation({
		mutationFn: async (code: string) => {
			const response = await apiClient.get<{
				accessToken: string
				expiresAt: string
				role: string
			}>(`/auth/oauth/google/callback?code=${code}`, {
				headers: {
					CustomOrigin: window.location.origin,
				},
			})

			const { accessToken } = response

			// Token is stored by apiClient interceptor via setTokens
			const { setTokens } = await import("@/services/token.service")
			setTokens(accessToken)

			const userResponse = await fetchUserProfile()
			const user = mapUserResponse(userResponse)
			setAuthUser(user)

			return { success: true }
		},
		onError: () => {
			clearAuth()
		},
	})
}

export const useVerifyFirstLogin = () => {
	return useMutation({
		mutationFn: async ({ email, code }: { email: string; code: string }) => {
			await verifyFirstLogin(email, code)

			const userResponse = await fetchUserProfile()
			const user = mapUserResponse(userResponse)
			setAuthUser(user)

			return user
		},
		onError: () => {
			clearAuth()
		},
	})
}

export const useRequestPasswordReset = () => {
	return useMutation({
		mutationFn: (email: string) => requestPasswordReset(email),
	})
}

export const useVerifyPasswordResetOTP = () => {
	return useMutation({
		mutationFn: ({ email, code }: { email: string; code: string }) => verifyPasswordResetOTP(email, code),
	})
}

export const useResetPassword = () => {
	return useMutation({
		mutationFn: ({ email, code, newPassword }: { email: string; code: string; newPassword: string }) =>
			resetPassword(email, code, newPassword),
	})
}

export const useLogoutMutation = () => {
	return useMutation({
		mutationFn: async () => {
			await logoutService()
		},
		onSettled: () => {
			// Always clear auth state, even if logout API fails
			clearAuth()
		},
	})
}
