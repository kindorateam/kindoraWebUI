export interface User {
	id: string
	email: string
	name: string
	picture?: string
	givenName?: string
	familyName?: string
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
