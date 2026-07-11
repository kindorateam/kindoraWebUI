import { RouterProvider } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { useAuthBootstrap } from "@/features/auth/hooks/useAuthBootstrap"
import { useLanguage } from "@/i18n/useLanguage"
import { authStateAtom } from "@/stores"

import { router } from "./router"

const InnerApp = () => {
	const auth = useAtomValue(authStateAtom)

	return <RouterProvider router={router} context={{ auth }} />
}

const App = () => {
	const { t } = useTranslation()
	useLanguage()
	const isAuthInitialized = useAuthBootstrap()

	// Don't render router until initial auth check is complete
	if (!isAuthInitialized) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div>{t("common.loading")}</div>
			</div>
		)
	}

	return <InnerApp />
}

export default App
