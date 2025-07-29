import { createFileRoute } from '@tanstack/react-router'

import { RouteErrorBoundary } from '@/components/error'
import { HomePage } from '@/pages/HomePage'

export const Route = createFileRoute('/')({
  component: () => (
    <RouteErrorBoundary routeName="home">
      <HomePage />
    </RouteErrorBoundary>
  ),
})
