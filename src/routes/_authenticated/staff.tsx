import { createFileRoute } from '@tanstack/react-router'

import StaffPage from '@/pages/StaffPage'

export const Route = createFileRoute('/_authenticated/staff')({
  component: StaffPage,
  beforeLoad: () => {
    return {
      breadcrumb: 'Staff',
    }
  },
})
