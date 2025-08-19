import { createFileRoute } from '@tanstack/react-router'

import { StudentsPage } from '@/pages'

export const Route = createFileRoute('/_authenticated/rooms')({
  component: StudentsPage,
  beforeLoad: () => {
    return {
      breadcrumb: 'Rooms',
    }
  },
})
