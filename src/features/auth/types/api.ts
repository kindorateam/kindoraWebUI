import type { User } from "./user"

// Request types
export interface EmailLoginCredentials {
	email: string
	password: string
}

export interface EmailRegisterCredentials extends EmailLoginCredentials {
	name: string
}

// Response types
export interface AuthTokens {
	accessToken: string
	refreshToken: string
	expiresIn: number
}

export interface RefreshTokenResponse {
	accessToken: string
	expiresIn: number
}

export interface AuthTokenResponse {
	accessToken: string
	expiresAt: string
	role: string
	// Note: RefreshToken is sent as HttpOnly cookie, not in response body
}

export interface VerificationRequiredResponse {
	status: string
	message: string
}

export type LoginResponse = AuthTokenResponse | VerificationRequiredResponse

export type UserProfileResponse = User | { user: User }

// Store action result
export type LoginResult =
	| { needsVerification: true; email: string; message: string }
	| { needsVerification: false; user: User }
