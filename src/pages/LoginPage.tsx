import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

import LogoIconLg from "@/components/icons/LogoIconLg"
import SignInCard from "@/features/auth/components/SignInCard"
import useAuth from "@/hooks/useAuth"
import { getReturnUrlFromLocation } from "@/services/redirect.service"

const LoginPage = () => {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

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

	return (
		<div className="grid h-screen place-items-center">
			<SignInCard />
		</div>
	)
}

export default LoginPage
