import { Button } from "@heroui/react"
import { Link, Navigate } from "@tanstack/react-router"
import { useAtomValue } from "jotai"

import PageLoader from "@/components/PageLoader"
import { authStateAtom } from "@/features/auth/stores/auth.store"

const HomePage = () => {
	const authState = useAtomValue(authStateAtom)

	if (authState.isLoading) {
		return <PageLoader />
	}

	if (authState.isAuthenticated) {
		return <Navigate to="/dashboard" />
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
			<div className="text-center">
				<h1 className="font-bold text-4xl text-gray-900">Welcome to Kindora</h1>
				<p className="text-gray-600 text-lg">Kindergarten Management System</p>
				<Link to="/login">
					<Button variant="primary" size="lg">
						Get Started
					</Button>
				</Link>
			</div>
		</div>
	)
}

export default HomePage
