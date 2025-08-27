import { createFileRoute } from '@tanstack/react-router'

import PlaceholderPage from '@/components/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/connections')({
  component: () => <PlaceholderPage name="Connections" />,
  beforeLoad: () => {
    return {
      breadcrumb: 'Connections',
    }
  },
})
