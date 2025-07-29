import { createFileRoute } from '@tanstack/react-router'

import { GuestRoute } from '@/components/auth/GuestRoute'

export const Route = createFileRoute('/_auth')({
  component: GuestRoute,
})
