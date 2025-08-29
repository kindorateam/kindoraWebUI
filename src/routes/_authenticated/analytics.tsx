import { createFileRoute } from '@tanstack/react-router'

import PlaceholderPage from '@/components/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: () => <PlaceholderPage name="Analytics" />,
  beforeLoad: () => {
    return {
      breadcrumb: 'Analytics',
    }
  },
})
