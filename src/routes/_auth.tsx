import { createFileRoute } from '@tanstack/react-router'

import GuestRoute from '@/components/GuestRoute'

export const Route = createFileRoute('/_auth')({
  component: GuestRoute,
})
