import { useState } from 'react'

import Filters from '@/components/Filters'
import usePageMetadata from '@/hooks/usePageMetadata'

import type { FilterProps } from '@/types/TableFilters'

interface SubHeaderProps {
  initialFilters?: FilterProps[]
}

const SubHeader = ({ initialFilters }: SubHeaderProps) => {
  const [filters, setFilters] = useState<FilterProps[]>(initialFilters ?? [])

  const { breadcrumbs } = usePageMetadata()

  const handleFilterChange = (filterId: string, newValue: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === filterId ? { ...filter, value: newValue } : filter,
      ),
    )
  }

  return (
    <div className="border-b border-[#0000000D]">
      <div className="container mb-7 flex max-w-7xl items-center justify-between">
        <h1 className="font-semibold lg:text-[36px]">
          {breadcrumbs[0]?.title}
        </h1>
        {initialFilters && (
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        )}
      </div>
    </div>
  )
}

export default SubHeader
