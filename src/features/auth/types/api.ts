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

// Wire shape of GET /users/profile — the backend returns the employee account DTO
export interface ApiProfileUser {
	id: string
	firstName: string
	lastName: string
	email?: string
	avatar?: { id: string; path: string }
}

export interface UserProfileResponse {
	user: ApiProfileUser
}

// Store action result
export type LoginResult =
	| { needsVerification: true; email: string; message: string }
	| { needsVerification: false; user: User }
