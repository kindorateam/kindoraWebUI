import { createFileRoute } from '@tanstack/react-router'

import { PlaceholderPage } from '@/components/layout'

export const Route = createFileRoute('/_authenticated/calendar')({
  component: () => <PlaceholderPage name="Calendar" />,
})