import { createFileRoute } from '@tanstack/react-router'

import { PlaceholderPage } from '@/components/layout'

export const Route = createFileRoute('/_authenticated/admissions')({
  component: () => <PlaceholderPage name="Admissions" />,
})