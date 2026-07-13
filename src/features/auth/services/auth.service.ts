import { apiClient } from "@/services/api.service"

import type {
	EmailLoginCredentials,
	GoogleLoginNonceResponse,
	LoginResponse,
	SessionResponse,
	UserProfileResponse,
} from "../types"

/**
 * Sign in with email and password
 * Returns an access JWT for memory and sets a rotating HttpOnly refresh cookie.
 */
export async function login(credentials: EmailLoginCredentials): Promise<LoginResponse> {
	try {
		const response = await apiClient.postRaw<LoginResponse>("/auth/login", {
			email: credentials.email,
			password: credentials.password,
		})

		const responseData = response.data
		const isVerificationResponse =
			response.status === 202 || ("status" in responseData && responseData.status === "verification_required")

		// Check if verification is required (202 response or explicit status field)
		if (isVerificationResponse) {
			return {
				status: "verification_required",
				message:
					"message" in responseData && typeof responseData.message === "string"
						? responseData.message
						: "Verification required",
			}
		}

		return responseData
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error("[auth.service] Login error:", error)
		}
		throw error
	}
}

/**
 * Fetch user profile after successful login
 * Call this after login() to get user details
 */
export async function fetchUserProfile(): Promise<UserProfileResponse> {
	return apiClient.get<UserProfileResponse>("/users/profile")
}

export async function restoreSession(): Promise<UserProfileResponse | null> {
	try {
		await apiClient.refreshAccessToken({ failureMode: "silent" })
		return await fetchUserProfile()
	} catch {
		return null
	}
}

export const createGoogleLoginNonce = (): Promise<GoogleLoginNonceResponse> =>
	apiClient.post<GoogleLoginNonceResponse>("/auth/google/nonce")

export const loginWithGoogle = (credential: string): Promise<SessionResponse> =>
	apiClient.post<SessionResponse>("/auth/google", { credential })

/**
 * Revoke the current token family and clear its HttpOnly refresh cookie.
 */
export async function logout(): Promise<void> {
	await apiClient.post("/auth/logout")
}

/**
 * Request password reset email
 * Sends OTP code to user's email
 */
export async function requestPasswordReset(email: string): Promise<void> {
	await apiClient.post("/auth/password/reset/request", { email })
}

/**
 * Verify OTP code (for password reset flow)
 * Returns 200 status with success message if code is valid
 */
export async function verifyPasswordResetOTP(email: string, code: string): Promise<void> {
	await apiClient.post("/auth/password/reset/verify", { email, code })
}

/**
 * Verify first login with OTP code
 * Activates the user, returns an access JWT, and sets a refresh cookie.
 */
export async function verifyFirstLogin(email: string, code: string): Promise<SessionResponse> {
	return apiClient.post<SessionResponse>("/auth/login/verify", {
		email,
		code,
	})
}

/**
 * Reset password with verified OTP token
 * @param email - User's email address
 * @param token - OTP code from password reset verification
 * @param newPassword - New password to set
 */
export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
	await apiClient.post("/auth/password/reset/set", {
		email,
		code,
		newPassword,
	})
}
