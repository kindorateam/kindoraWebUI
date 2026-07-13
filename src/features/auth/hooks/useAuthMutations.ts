import { useMutation } from "@tanstack/react-query"

import { publishAuthEvent } from "@/services/auth-events.service"

import {
	fetchUserProfile,
	login,
	loginWithGoogle,
	logout as logoutService,
	requestPasswordReset,
	resetPassword,
	verifyFirstLogin,
	verifyPasswordResetOTP,
} from "../services/auth.service"
import { clearAuth, getAuthCredentials, mapUserResponse, setAuthCredentials, setAuthUser } from "../stores/auth.store"

import type { LoginResult, SessionResponse, User } from "../types"

const completeAuthSession = async (session: SessionResponse): Promise<User> => {
	setAuthCredentials(session)
	const userResponse = await fetchUserProfile()
	const user = mapUserResponse(userResponse)
	setAuthUser(user)
	publishAuthEvent("session-started", session.sessionVersion)
	return user
}

export const useEmailLogin = () => {
	return useMutation({
		mutationFn: async (credentials: { email: string; password: string }): Promise<LoginResult> => {
			const response = await login(credentials)

			if (!("accessToken" in response)) {
				return { needsVerification: true, email: credentials.email, message: response.message }
			}

			const user = await completeAuthSession(response)

			return { needsVerification: false, user }
		},
		onError: () => {
			clearAuth()
		},
	})
}

export const useGoogleLoginMutation = () => {
	return useMutation({
		mutationFn: async (credential: string) => {
			const response = await loginWithGoogle(credential)
			await completeAuthSession(response)

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
			const response = await verifyFirstLogin(email, code)
			return completeAuthSession(response)
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
			const sessionVersion = getAuthCredentials().sessionVersion
			try {
				await logoutService()
			} finally {
				if (!sessionVersion) {
					clearAuth()
				} else if (clearAuth(sessionVersion)) {
					publishAuthEvent("session-ended", sessionVersion)
				}
			}
		},
	})
}
