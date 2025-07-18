export interface User {
  id: string
  email: string
  name: string
  picture?: string
  givenName?: string
  familyName?: string
}

export interface AuthState {
  user: User | null
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
