import usePageMetadata from '@/hooks/usePageMetadata'

interface SubHeaderProps {
  bottomSlot?: React.ReactNode
  endSlot?: React.ReactNode
}

const SubHeader = ({ bottomSlot, endSlot }: SubHeaderProps) => {
  const { breadcrumbs } = usePageMetadata()

  return (
    <div className="border-b border-[#0000000D]">
      <div className="container max-w-7xl">
        <div className="mb-7 flex items-center justify-between">
          <h1 className="font-semibold lg:text-[36px]">
            {breadcrumbs[0]?.title}
          </h1>
          {endSlot}
        </div>
        <div className="flex items-center justify-between">{bottomSlot}</div>
      </div>
    </div>
  )
}

export default SubHeader
