import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { getReturnUrlFromLocation } from "@/services/redirect.service"

import useAuth from "../hooks/useAuth"

import SignInCard from "./SignInCard"

type AuthView = "signin" | "forgot-password" | "otp-verification" | "otp-password-reset" | "reset-password"

export default function LoginPage() {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()
	const [view, setView] = useState<AuthView>("signin")
	const [userEmail, setUserEmail] = useState("")
	const [resetToken, setResetToken] = useState("")
	const [codeSentAt, setCodeSentAt] = useState<number | null>(null)

	useEffect(() => {
		const returnUrl = getReturnUrlFromLocation()
		if (returnUrl && returnUrl !== "/login") {
			sessionStorage.setItem("authRedirectUrl", returnUrl)
		}
	}, [])

	useEffect(() => {
		if (isAuthenticated) {
			const storedUrl = sessionStorage.getItem("authRedirectUrl")
			const urlParam = getReturnUrlFromLocation()
			const returnUrl = storedUrl ?? urlParam

			if (storedUrl) {
				sessionStorage.removeItem("authRedirectUrl")
			}

			const destination = returnUrl && returnUrl !== "/login" ? returnUrl : "/dashboard"

			void navigate({ to: destination })
		}
	}, [isAuthenticated, navigate])

	return (
		<div className="flex min-h-screen items-center justify-center">
			<SignInCard
				codeSentAt={codeSentAt}
				resetToken={resetToken}
				setCodeSentAt={setCodeSentAt}
				setResetToken={setResetToken}
				setUserEmail={setUserEmail}
				setView={setView}
				userEmail={userEmail}
				view={view}
			/>
		</div>
	)
}
