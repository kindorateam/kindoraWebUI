export interface User {
	id: string
	email: string
	name: string
	picture?: string
	givenName?: string
	familyName?: string
}

export type AuthProviderType = "google" | "email"

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

export interface GoogleAuthResponse {
	credential: string
}

export interface DecodedGoogleToken {
	aud: string
	azp: string
	email: string
	email_verified: boolean
	exp: number
	family_name?: string
	given_name?: string
	iat: number
	iss: string
	jti: string
	name: string
	nbf: number
	picture?: string
	sub: string
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
