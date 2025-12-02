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
