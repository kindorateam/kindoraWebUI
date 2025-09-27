import { Card, CardBody, CardHeader } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { useCallback, useEffect, useId } from "react"

import LogoIconLg from "@/components/icons/LogoIconLg"
import useAuth from "@/hooks/useAuth"
import { getReturnUrlFromLocation } from "@/services/redirect.service"

const LoginPage = () => {
	const { handleGoogleLogin, error, isAuthenticated } = useAuth()
	const navigate = useNavigate()
	const googleButtonId = useId().replace(/:/g, "")

	// Store redirect URL in sessionStorage on component mount
	useEffect(() => {
		const returnUrl = getReturnUrlFromLocation()
		if (returnUrl && returnUrl !== "/login") {
			sessionStorage.setItem("authRedirectUrl", returnUrl)
		}
	}, [])

	// Navigate after successful authentication
	useEffect(() => {
		if (isAuthenticated) {
			// First try to get from sessionStorage, then from URL
			const storedUrl = sessionStorage.getItem("authRedirectUrl")
			const urlParam = getReturnUrlFromLocation()
			const returnUrl = storedUrl ?? urlParam

			// Clear the stored URL after using it
			if (storedUrl) {
				sessionStorage.removeItem("authRedirectUrl")
			}

			const destination = returnUrl && returnUrl !== "/login" ? returnUrl : "/dashboard"
			void navigate({ to: destination })
		}
	}, [isAuthenticated, navigate])

	const initializeGoogleSignIn = useCallback(() => {
		if (window.google?.accounts) {
			window.google.accounts.id.initialize({
				client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				callback: handleGoogleLogin,
			})

			const buttonDiv = document.getElementById(googleButtonId)

			if (buttonDiv) {
				window.google.accounts.id.renderButton(buttonDiv, {
					theme: "outline",
					size: "large",
					type: "standard",
					shape: "rectangular",
				})
			}
		}
	}, [googleButtonId, handleGoogleLogin])

	useEffect(() => {
		// Check if script is already loaded
		if (window.google?.accounts) {
			initializeGoogleSignIn()
			return
		}

		// Check if script is already in the DOM
		const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
		if (existingScript) {
			// Script exists but not loaded yet, wait for it
			existingScript.addEventListener("load", initializeGoogleSignIn)
			return () => {
				existingScript.removeEventListener("load", initializeGoogleSignIn)
			}
		}

		// Load script for the first time
		const script = document.createElement("script")
		script.src = "https://accounts.google.com/gsi/client"
		script.async = true
		script.defer = true
		script.onload = initializeGoogleSignIn
		document.head.appendChild(script)

		// Cleanup function
		return () => {
			script.removeEventListener("load", initializeGoogleSignIn)
		}
	}, [initializeGoogleSignIn])

	return (
		<div className="grid h-screen grid-cols-1 lg:grid-cols-[2fr_3fr]">
			<div className="flex items-center justify-center bg-brand">
				<LogoIconLg />
			</div>
			<div className="flex items-center justify-center bg-[#F7F7F2]">
				<Card className="w-full max-w-[352px] bg-transparent shadow-none">
					<CardHeader className="p-0 font-bold text-[34px]">Sign in</CardHeader>
					<CardBody className="w-full px-0 py-10.5">
						{error && <div className="rounded-md bg-red-50 p-3 text-red-600 text-sm">{error}</div>}

						<div className="flex w-full max-w-[352px] justify-center" id={googleButtonId} />
					</CardBody>
				</Card>
			</div>
		</div>
	)
}

export default LoginPage
