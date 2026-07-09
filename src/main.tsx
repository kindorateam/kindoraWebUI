import { Toast } from "@heroui/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Provider as JotaiProvider } from "jotai"
import { createRoot } from "react-dom/client"

import "./index.css"
import "@/i18n"

import { queryClient } from "@/services/queryClient"
import { appStore } from "@/stores/jotaiStore"

import App from "./App"
import { ErrorBoundary } from "./components/error"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Root element not found")

createRoot(rootElement).render(
	<ErrorBoundary
		level="root"
		onError={(error, errorInfo) => {
			// In production, you might want to send this to an error tracking service
			console.error("Root Application Error:", error, errorInfo)
		}}
	>
		<JotaiProvider store={appStore}>
			<QueryClientProvider client={queryClient}>
				<Toast.Provider placement="bottom end" />
				<App />
			</QueryClientProvider>
		</JotaiProvider>
	</ErrorBoundary>,
)
