import { createFileRoute } from '@tanstack/react-router'

import StaffTable from '@/components/StaffTable'

export const Route = createFileRoute('/_authenticated/staff')({
  component: StaffTable,
  beforeLoad: () => {
    return {
      breadcrumb: 'Staff',
    }
  },
})
