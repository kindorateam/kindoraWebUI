import { createFileRoute } from '@tanstack/react-router'

import ProtectedRoute from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated')({
  component: ProtectedRoute,
})
