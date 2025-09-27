import CompactErrorFallback from "./CompactErrorFallback"
import { ErrorBoundary } from "./ErrorBoundary"

import type { ReactNode } from "react"

interface RouteErrorBoundaryProps {
	children: ReactNode
	routeName?: string
}

const RouteErrorBoundary = ({ children, routeName }: RouteErrorBoundaryProps) => {
	return (
		<ErrorBoundary
			fallback={(error, resetError) => <CompactErrorFallback error={error} resetError={resetError} />}
			isolate
			level={`route-${routeName ?? "unknown"}`}
			onError={(error, errorInfo) => {
				console.error(`Route Error [${routeName}]:`, error, errorInfo)
			}}
			resetOnPropsChange
		>
			{children}
		</ErrorBoundary>
	)
}

export default RouteErrorBoundary
