import { createFileRoute } from '@tanstack/react-router'

import PlaceholderPage from '@/components/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/connections/messages')({
  component: () => <PlaceholderPage name="Messages" />,
  beforeLoad: () => {
    return {
      breadcrumb: 'Messages',
    }
  },
})
