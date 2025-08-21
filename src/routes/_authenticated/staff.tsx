import { createFileRoute } from '@tanstack/react-router'

import StaffTable from '@/components/StaffTable'

const StaffPage = () => {
  return <StaffTable />
}

export const Route = createFileRoute('/_authenticated/staff')({
  component: StaffPage,
  beforeLoad: () => {
    return {
      breadcrumb: 'Staff',
    }
  },
})
