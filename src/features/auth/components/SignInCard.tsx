import { Card } from "@heroui/react"

import ForgotPasswordForm from "./ForgotPasswordForm"
import OTPVerificationForm from "./OTPVerificationForm"
import ResetPasswordForm from "./ResetPasswordForm"
import SignInForm from "./SignInForm"

type AuthView = "signin" | "forgot-password" | "otp-verification" | "otp-password-reset" | "reset-password"

interface SignInCardProps {
	view: AuthView
	setView: (view: AuthView) => void
	userEmail: string
	setUserEmail: (email: string) => void
	resetToken: string
	setResetToken: (token: string) => void
}

const SignInCard = ({ view, setView, userEmail, setUserEmail, resetToken, setResetToken }: SignInCardProps) => {
	// Called when user successfully logs in (verified user)
	const handleSignInSuccess = (_email: string) => {
		// User is already logged in, no need to show OTP
		// Navigation is handled by router
	}

	// Called when new user needs to verify OTP for first login
	const handleVerificationRequired = (email: string, _message: string) => {
		setUserEmail(email)
		setView("otp-verification")
	}

	// Called after OTP is verified successfully for first login
	const handleOTPSuccess = () => {
		// User is now logged in, navigation is handled by router
	}

	// Called when user requests password reset
	const handleForgotPassword = () => {
		setView("forgot-password")
	}

	// Called after forgot password email is sent and user clicks "Next"
	const handleForgotPasswordNext = (email: string) => {
		setUserEmail(email)
		setView("otp-password-reset")
	}

	// Called after OTP is verified successfully for password reset
	const handlePasswordResetOTPSuccess = (token?: string) => {
		if (token) {
			setResetToken(token)
			setView("reset-password")
		}
	}

	// Called after password is successfully reset
	const handleResetPasswordSuccess = () => {
		// Clear reset token and navigate back to sign in
		setResetToken("")
		setView("signin")
	}

	return (
		<Card className="w-full max-w-[396px] bg-white">
			{view === "signin" && (
				<SignInForm
					defaultEmail={userEmail}
					onForgotPassword={handleForgotPassword}
					onSignInSuccess={handleSignInSuccess}
					onVerificationRequired={handleVerificationRequired}
				/>
			)}

			{view === "forgot-password" && (
				<ForgotPasswordForm onBack={() => setView("signin")} onNext={handleForgotPasswordNext} />
			)}

			{view === "otp-verification" && (
				<OTPVerificationForm
					context="login"
					email={userEmail}
					onBack={() => setView("signin")}
					onSuccess={handleOTPSuccess}
				/>
			)}

			{view === "otp-password-reset" && (
				<OTPVerificationForm
					context="password-reset"
					email={userEmail}
					onBack={() => setView("forgot-password")}
					onSuccess={handlePasswordResetOTPSuccess}
				/>
			)}

			{view === "reset-password" && (
				<ResetPasswordForm
					email={userEmail}
					onBack={() => setView("otp-password-reset")}
					onResetSuccess={handleResetPasswordSuccess}
					token={resetToken}
				/>
			)}
		</Card>
	)
}

export default SignInCard
