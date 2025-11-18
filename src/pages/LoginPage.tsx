import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import SignInCard from "@/features/auth/components/SignInCard"
import useAuth from "@/features/auth/hooks/useAuth"
import { getReturnUrlFromLocation } from "@/features/auth/services/redirect.service"

type AuthView = "signin" | "forgot-password" | "otp-verification" | "otp-password-reset" | "reset-password"

const LoginPage = () => {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()
	// Lift state up to prevent loss on SignInCard remount
	const [view, setView] = useState<AuthView>("signin")
	const [userEmail, setUserEmail] = useState("")
	const [resetToken, setResetToken] = useState("")

	// Store redirect URL in sessionStorage on component mount
	useEffect(() => {
		const returnUrl = getReturnUrlFromLocation()
		if (returnUrl && returnUrl !== "/login") {
			sessionStorage.setItem("authRedirectUrl", returnUrl)
		}
	}, [])

	// Debug auth state changes
	useEffect(() => {
		if (import.meta.env.DEV) {
			console.log("[LoginPage] isAuthenticated changed to:", isAuthenticated)
		}
	}, [isAuthenticated])

	// Navigate after successful authentication
	useEffect(() => {
		if (isAuthenticated) {
			console.log("[LoginPage] User is authenticated - navigating away")
			// First try to get from sessionStorage, then from URL
			const storedUrl = sessionStorage.getItem("authRedirectUrl")
			const urlParam = getReturnUrlFromLocation()
			const returnUrl = storedUrl ?? urlParam

			// Clear the stored URL after using it
			if (storedUrl) {
				sessionStorage.removeItem("authRedirectUrl")
			}

			const destination = returnUrl && returnUrl !== "/login" ? returnUrl : "/dashboard"
			console.log("[LoginPage] Navigating to:", destination)
			void navigate({ to: destination })
		}
	}, [isAuthenticated, navigate])

	return (
		<div className="grid h-screen place-items-center">
			<SignInCard
				resetToken={resetToken}
				setResetToken={setResetToken}
				setUserEmail={setUserEmail}
				setView={setView}
				userEmail={userEmail}
				view={view}
			/>
		</div>
	)
}

export default LoginPage
