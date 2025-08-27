import { Button, Skeleton, Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'

import { getRoomById } from '@/services/room.service'

type TabType = 'students' | 'activity' | 'profile'

interface RoomDetailSubHeaderProps {
  roomId: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const RoomDetailSubHeader = ({
  roomId,
  activeTab,
  onTabChange,
}: RoomDetailSubHeaderProps) => {
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getRoomById(roomId),
  })
  return (
    <div className="border-b border-[#0000000D]">
      <div className="container max-w-7xl">
        {/* Header with title and action button */}
        <div className="mb-4 flex items-center justify-between pt-6">
          <div>
            {isLoading ? (
              <Skeleton className="h-10 w-64 rounded-lg" />
            ) : (
              <h1 className="font-semibold lg:text-[36px]">
                {room?.name ?? `Room ${roomId}`}
              </h1>
            )}
          </div>
          <div className="flex gap-2">
            <Button color="primary" variant="light">
              Export
            </Button>
            <Button color="primary">Add Student</Button>
          </div>
        </div>

        {/* Tabs navigation */}
        <Tabs
          aria-label="Room details tabs"
          classNames={{
            base: 'w-full',
            tabList: 'gap-6 w-full relative rounded-none p-0 border-b-0',
            cursor: 'w-full bg-primary',
            tab: 'max-w-fit px-0 h-12',
            tabContent: 'group-data-[selected=true]:text-primary',
          }}
          onSelectionChange={(key) => onTabChange(key as TabType)}
          selectedKey={activeTab}
        >
          <Tab key="students" title="Students" />
          <Tab key="activity" title="Activity" />
          <Tab key="profile" title="Profile" />
        </Tabs>
      </div>
    </div>
  )
}

export default RoomDetailSubHeader
