import { useState } from 'react'

import Filters from '@/components/Filters'
import StudentsTable from '@/components/StudentsTable'
import SubHeader from '@/components/SubHeader'

import type { FilterProps } from '@/types/TableFilters'

const studentsFilters = [
  {
    id: 'groupBy',
    label: 'Group By',
    value: '',
    options: [
      { value: '', label: 'No Grouping' },
      { value: 'capacity', label: 'Capacity' },
      { value: 'occupancy', label: 'Occupancy' },
      { value: 'roomType', label: 'Room Type' },
    ],
  },
  {
    id: 'roomBy',
    label: 'Room By',
    value: '',
    options: [
      { value: '', label: 'All' },
      { value: '11-20', label: '11-20 Students' },
      { value: '21+', label: '21+ Students' },
    ],
  },
  {
    id: 'tagsBy',
    label: 'Tags by',
    value: '',
    options: [
      { value: '', label: 'All' },
      { value: 'empty', label: 'Empty' },
      { value: 'partial', label: 'Partially Filled' },
      { value: 'full', label: 'Full' },
    ],
  },
  {
    id: 'Status by',
    label: 'Status by',
    value: '',
    options: [
      { value: '', label: 'All Rooms' },
      { value: 'turtle', label: 'Baby Turtles' },
      { value: 'rabbit', label: 'Happy Rabbits' },
      { value: 'bear', label: 'Curious Bears' },
      { value: 'butterfly', label: 'Bright Butterflies' },
      { value: 'owl', label: 'Wise Owls' },
      { value: 'fox', label: 'Clever Foxes' },
    ],
  },
]

const StudentsPage = () => {
  const [filters, setFilters] = useState<FilterProps[]>(studentsFilters ?? [])

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
      <main className="container max-w-7xl pt-10">
        <StudentsTable />
      </main>
    </>
  )
}

export default StudentsPage
