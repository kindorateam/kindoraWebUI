import { Card } from "@heroui/react"
import { useState } from "react"

import ForgotPasswordForm from "./ForgotPasswordForm"
import SignInForm from "./SignInForm"

export default function SignInCard() {
	const [view, setView] = useState<"signin" | "forgot-password">("signin")

	return (
		<Card className="w-full max-w-[396px] bg-white shadow-md">
			{view === "signin" ? (
				<SignInForm onForgotPassword={() => setView("forgot-password")} />
			) : (
				<ForgotPasswordForm onBack={() => setView("signin")} />
			)}
		</Card>
	)
}
