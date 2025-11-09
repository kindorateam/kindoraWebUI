import { Card } from "@heroui/react"
import { useState } from "react"

import ForgotPasswordForm from "./ForgotPasswordForm"
import OTPVerificationForm from "./OTPVerificationForm"
import SignInForm from "./SignInForm"

export default function SignInCard() {
	const [view, setView] = useState<"signin" | "forgot-password" | "otp-verification">("signin")
	const [userEmail, setUserEmail] = useState("")

	const handleSignInSuccess = (email: string) => {
		setUserEmail(email)
		setView("otp-verification")
	}

	const handleOTPSuccess = () => {
		// TODO: Navigate to dashboard or next screen
		console.log("OTP verified successfully")
	}

	return (
		<Card className="w-full max-w-[396px] bg-white shadow-md">
			{view === "signin" && (
				<SignInForm onForgotPassword={() => setView("forgot-password")} onSignInSuccess={handleSignInSuccess} />
			)}
			{view === "forgot-password" && <ForgotPasswordForm onBack={() => setView("signin")} />}
			{view === "otp-verification" && (
				<OTPVerificationForm email={userEmail} onBack={() => setView("signin")} onSuccess={handleOTPSuccess} />
			)}
		</Card>
	)
}
