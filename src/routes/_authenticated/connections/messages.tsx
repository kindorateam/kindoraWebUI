import { createFileRoute } from '@tanstack/react-router'

import MessagesPage from '@/pages/MessagesPage'

export const Route = createFileRoute('/_authenticated/connections/messages')({
  component: () => <MessagesPage />,
  beforeLoad: () => {
    return {
      breadcrumb: 'Messages',
    }
  },
})
