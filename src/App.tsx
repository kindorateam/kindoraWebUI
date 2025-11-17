import { RouterProvider } from "@tanstack/react-router"
import { useAtom, useAtomValue } from "jotai"
import { useEffect } from "react"

import { router } from "./router"

import { authInitializedAtom, authStateAtom, checkAuthAtom } from "@/stores"

function InnerApp() {
	const auth = useAtomValue(authStateAtom)

	return <RouterProvider router={router} context={{ auth }} />
}

const App = () => {
	const [, checkAuth] = useAtom(checkAuthAtom)
	const isAuthInitialized = useAtomValue(authInitializedAtom)

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	// Don't render router until initial auth check is complete
	if (!isAuthInitialized) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div>Loading...</div>
			</div>
		)
	}

	return <InnerApp />
}

export default App
