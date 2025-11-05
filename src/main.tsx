import { GoogleOAuthProvider } from "@react-oauth/google"
import { HeroUIProvider } from "@heroui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider as JotaiProvider } from "jotai"
import { createRoot } from "react-dom/client"
import "jotai-devtools/styles.css"

import "./index.css"

import App from "./App"
import { ErrorBoundary } from "./components/error"

import { appStore } from "@/stores/jotaiStore"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
			retry: 1,
		},
	},
})

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
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<JotaiProvider store={appStore}>
				<QueryClientProvider client={queryClient}>
					<HeroUIProvider>
						<App />
					</HeroUIProvider>
				</QueryClientProvider>
			</JotaiProvider>
		</GoogleOAuthProvider>
	</ErrorBoundary>,
)
