import { createFileRoute } from '@tanstack/react-router'

import StaffTable from '@/components/StaffTable'

const StaffPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Staff</h1>
      </div>
      <StaffTable />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/staff')({
  component: StaffPage,
  beforeLoad: () => {
    return {
      breadcrumb: 'Staff',
    }
  },
})
