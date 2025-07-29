import { createFileRoute } from '@tanstack/react-router'

import { PlaceholderPage } from '@/components/layout'

export const Route = createFileRoute('/_authenticated/news-activity')({
  component: () => <PlaceholderPage name="News Activity" />,
})
