// Core Auth Types
export interface User {
	id: string
	email: string
	name: string
	picture?: string
	givenName?: string
	familyName?: string
}

export type AuthProviderType = "email"

export interface AuthProvider {
	type: AuthProviderType
	credential?: string
	accessToken?: string
	refreshToken?: string
	expiresAt: number
}

export interface AuthUser extends User {
	provider: AuthProvider
}

export interface AuthState {
	user: AuthUser | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}

export interface DecodedBackendToken {
	sub: string // user id
	role: string
	cid: string // company/client id
	iss: string // issuer
	exp: number // expiration timestamp
	iat: number // issued at timestamp
	typ: "access_token"
}

export interface EmailLoginCredentials {
	email: string
	password: string
}

export interface EmailRegisterCredentials extends EmailLoginCredentials {
	name: string
}

export interface AuthTokens {
	accessToken: string
	refreshToken: string
	expiresIn: number
}

export interface RefreshTokenResponse {
	accessToken: string
	expiresIn: number
}

// Form Data Types
export interface SignInFormData {
	email: string
	password: string
	rememberMe: boolean
}

export interface ForgotPasswordFormData {
	email: string
}

export interface OTPVerificationFormData {
	otp: string
}

export interface ResetPasswordFormData {
	password: string
	confirmPassword: string
}
