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
