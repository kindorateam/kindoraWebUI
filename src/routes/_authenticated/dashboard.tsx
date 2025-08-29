import { createFileRoute } from '@tanstack/react-router'

import { RouteErrorBoundary } from '@/components/error'
import DashboardPage from '@/pages/DashboardPage'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: () => (
    <RouteErrorBoundary routeName="dashboard">
      <DashboardPage />
    </RouteErrorBoundary>
  ),
  beforeLoad: () => {
    return {
      breadcrumb: 'Dashboard',
    }
  },
})
