import type { User } from "./user"

// Request types
export interface EmailLoginCredentials {
	email: string
	password: string
}

export interface EmailRegisterCredentials extends EmailLoginCredentials {
	name: string
}

export interface SessionResponse {
	accessToken: string
	expiresAt: string
	role: string
	sessionVersion: string
}

export interface GoogleLoginNonceResponse {
	nonce: string
	expiresAt: string
}

export interface VerificationRequiredResponse {
	status: string
	message: string
}

export type LoginResponse = SessionResponse | VerificationRequiredResponse

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
