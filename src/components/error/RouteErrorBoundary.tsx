import CompactErrorFallback from './CompactErrorFallback'
import { ErrorBoundary } from './ErrorBoundary'

import type { ReactNode } from 'react'

interface RouteErrorBoundaryProps {
  children: ReactNode
  routeName?: string
}

const RouteErrorBoundary = ({
  children,
  routeName,
}: RouteErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      level={`route-${routeName ?? 'unknown'}`}
      fallback={(error, resetError) => (
        <CompactErrorFallback error={error} resetError={resetError} />
      )}
      onError={(error, errorInfo) => {
        console.error(`Route Error [${routeName}]:`, error, errorInfo)
      }}
      resetOnPropsChange
      isolate
    >
      {children}
    </ErrorBoundary>
  )
}

export default RouteErrorBoundary
