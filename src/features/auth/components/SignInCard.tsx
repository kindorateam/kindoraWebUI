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
	codeSentAt: number | null
	setCodeSentAt: (timestamp: number | null) => void
}

const SignInCard = ({
	view,
	setView,
	userEmail,
	setUserEmail,
	resetToken,
	setResetToken,
	codeSentAt,
	setCodeSentAt,
}: SignInCardProps) => {
	const handleVerificationRequired = (email: string, _message: string, sentAt: number) => {
		setUserEmail(email)
		setCodeSentAt(sentAt)
		setView("otp-verification")
	}

	const handleForgotPassword = () => {
		setView("forgot-password")
	}

	const handleForgotPasswordNext = (email: string, sentAt: number) => {
		setUserEmail(email)
		setCodeSentAt(sentAt)
		setView("otp-password-reset")
	}

	const handlePasswordResetOTPSuccess = (token?: string) => {
		if (token) {
			setResetToken(token)
			setView("reset-password")
		}
	}

	const handleResetPasswordSuccess = () => {
		setResetToken("")
		setView("signin")
	}

	return (
		<Card className="w-full max-w-99 p-6">
			{view === "signin" && (
				<SignInForm
					defaultEmail={userEmail}
					onForgotPassword={handleForgotPassword}
					onVerificationRequired={handleVerificationRequired}
				/>
			)}

			{view === "forgot-password" && (
				<ForgotPasswordForm
					defaultEmail={userEmail}
					onBack={() => setView("signin")}
					onNext={handleForgotPasswordNext}
				/>
			)}

			{view === "otp-verification" && (
				<OTPVerificationForm
					codeSentAt={codeSentAt}
					context="login"
					email={userEmail}
					onBack={() => setView("signin")}
				/>
			)}

			{view === "otp-password-reset" && (
				<OTPVerificationForm
					codeSentAt={codeSentAt}
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
