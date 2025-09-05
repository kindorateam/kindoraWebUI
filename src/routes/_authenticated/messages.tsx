import { createFileRoute } from '@tanstack/react-router'

import MessagesPage from '@/pages/MessagesPage'

export const Route = createFileRoute('/_authenticated/messages')({
  component: () => <MessagesPage />,
  validateSearch: (s: Record<string, unknown>) => {
    const t = String((s.tab ?? '') as string)
    const allowed = ['parents', 'rooms'] as const

    return {
      tab: allowed.includes(t as (typeof allowed)[number]) ? t : 'parents',
    }
  },
  beforeLoad: () => {
    return {
      breadcrumb: 'Messages',
    }
  },
})
