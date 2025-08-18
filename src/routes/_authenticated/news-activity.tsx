import { createFileRoute } from '@tanstack/react-router'

import PlaceholderPage from '@/components/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/news-activity')({
  component: () => <PlaceholderPage name="News Activity" />,
})
