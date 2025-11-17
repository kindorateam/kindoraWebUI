import { apiClient } from "./api.service"
import { clearToken, setTokens } from "./token.service"

import type { User } from "@/types/auth"

interface LoginCredentials {
	email: string
	password: string
}

interface AuthTokenResponse {
	accessToken: string
	expiresAt: string
	role: string
	// Note: RefreshToken is sent as HttpOnly cookie, not in response body
}

interface VerificationRequiredResponse {
	status: "verification_required"
	message: string
}

type LoginResponse = AuthTokenResponse | VerificationRequiredResponse

export type UserProfileResponse = User | { user: User }

/**
 * Sign in with email and password
 * Returns either tokens (verified user) or verification required status (new user)
 * Refresh token is set as HttpOnly cookie by backend (only for verified users)
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
	try {
		const response = await apiClient.postRaw<LoginResponse>("/auth/login", {
			email: credentials.email,
			password: credentials.password,
		})

		const responseData = response.data
		const isVerificationResponse =
			response.status === 202 || ("status" in responseData && responseData.status === "verification_required")

		if (import.meta.env.DEV) {
			console.log("[auth.service] Login response:", response)
			console.log("[auth.service] Parsed data:", responseData)
			console.log("[auth.service] isVerificationResponse:", isVerificationResponse)
		}

		// Check if verification is required (202 response or explicit status field)
		if (isVerificationResponse) {
			if (import.meta.env.DEV) {
				console.log("[auth.service] Verification required")
			}
			// Don't store any tokens - user needs to verify first
			return {
				status: "verification_required",
				message:
					"message" in responseData && typeof responseData.message === "string"
						? responseData.message
						: "Verification required",
			}
		}

		// Verified user - store access token (refresh token is in HttpOnly cookie)
		if ("accessToken" in responseData) {
			if (import.meta.env.DEV) {
				console.log("[auth.service] Storing access token")
			}
			setTokens(responseData.accessToken)
		}

		return responseData
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error("[auth.service] Login error:", error)
		}
		// Clear any stale tokens on login failure
		clearToken()
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

/**
 * Logout user and clear all tokens
 * Calls backend to clear HttpOnly refresh token cookie
 */
export async function logout(): Promise<void> {
	try {
		// Call logout endpoint to clear HttpOnly cookie
		await apiClient.post("/auth/logout")
	} finally {
		// Always clear access token, even if logout request fails
		clearToken()
	}
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
export async function verifyPasswordResetOTP(email: string, token: string): Promise<void> {
	await apiClient.post("/auth/password/reset/verify", { email, token })
}

/**
 * Verify first login with OTP code
 * Returns access token and user is logged in
 * Refresh token is set as HttpOnly cookie by backend
 */
export async function verifyFirstLogin(email: string, code: string): Promise<AuthTokenResponse> {
	try {
		const response = await apiClient.post<AuthTokenResponse>("/auth/login/verify", {
			email,
			code,
		})

		// Store access token (refresh token is in HttpOnly cookie)
		setTokens(response.accessToken)

		return response
	} catch (error) {
		// Clear any stale tokens on verification failure
		clearToken()
		throw error
	}
}

/**
 * Reset password with verified OTP token
 * @param email - User's email address
 * @param token - OTP code from password reset verification
 * @param newPassword - New password to set
 */
export async function resetPassword(email: string, token: string, newPassword: string): Promise<void> {
	await apiClient.post("/auth/password/reset/set", {
		email,
		token,
		new_password: newPassword,
	})
}
