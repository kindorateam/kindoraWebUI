import { createFileRoute } from '@tanstack/react-router'

import NewsActivityPage from '@/pages/NewsActivityPage'

export const Route = createFileRoute('/_authenticated/news-activity')({
  component: () => <NewsActivityPage />,
  beforeLoad: () => {
    return {
      breadcrumb: 'News & Activity',
    }
  },
})
