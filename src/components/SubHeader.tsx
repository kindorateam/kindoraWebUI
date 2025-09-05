import usePageMetadata from '@/hooks/usePageMetadata'

interface SubHeaderProps {
  endSlot?: React.ReactNode
}

const SubHeader = ({ endSlot }: SubHeaderProps) => {
  const { breadcrumbs } = usePageMetadata()

  // const handleFilterChange = (filterId: string, newValue: string) => {
  //   setFilters((prevFilters) =>
  //     prevFilters.map((filter) =>
  //       filter.id === filterId ? { ...filter, value: newValue } : filter,
  //     ),
  //   )
  // }

  return (
    <div className="border-b border-[#0000000D]">
      <div className="container mb-7 flex max-w-7xl items-center justify-between">
        <h1 className="font-semibold lg:text-[36px]">
          {breadcrumbs[0]?.title}
        </h1>
        {endSlot}
      </div>
    </div>
  )
}

export default SubHeader
