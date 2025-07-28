import { createFileRoute } from '@tanstack/react-router'

import { PlaceholderPage } from '@/components/layout'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: () => <PlaceholderPage name="Analytics" />,
})