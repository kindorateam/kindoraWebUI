import { createFileRoute } from '@tanstack/react-router'

import NewslettersPage from '@/pages/NewslettersPage'

export const Route = createFileRoute('/_authenticated/newsletters')({
  component: () => <NewslettersPage />,
  validateSearch: (s: Record<string, unknown>) => {
    const t = String((s.tab ?? '') as string)
    const allowed = ['sent', 'scheduled', 'drafts'] as const

    return {
      tab: allowed.includes(t as (typeof allowed)[number]) ? t : 'drafts',
    }
  },
  beforeLoad: () => ({ breadcrumb: 'Newsletters' }),
})
