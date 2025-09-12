import { useState } from 'react'

import Filters from '@/components/Filters'
import StaffTable from '@/components/StaffTable'
import SubHeader from '@/components/SubHeader'

import type { FilterProps } from '@/types/TableFilters'

const staffFilters = [
  {
    id: 'status',
    label: 'Status',
    value: '', // No selection - will show "Status: None"
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  {
    id: 'role',
    label: 'Role',
    value: 'admin', // Selected - will show "Role: Administrator"
    options: [
      { value: 'all', label: 'All Roles' },
      { value: 'admin', label: 'Administrator' },
      { value: 'teacher', label: 'Teacher' },
    ],
  },
  {
    id: 'location',
    label: 'Location',
    value: 'none', // Default - will show "Location: None"
    options: [
      { value: 'none', label: 'No Location Filter' },
      { value: 'main', label: 'Main Campus' },
      { value: 'remote', label: 'Remote' },
    ],
  },
]

const StaffPage = () => {
  const [filters, setFilters] = useState<FilterProps[]>(staffFilters ?? [])

  const handleFilterChange = (filterId: string, newValue: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === filterId ? { ...filter, value: newValue } : filter,
      ),
    )
  }

  return (
    <>
      <SubHeader
        endSlot={
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        }
      />
      <main className="container max-w-4xl pt-10">
        <StaffTable />
      </main>
    </>
  )
}

export default StaffPage
