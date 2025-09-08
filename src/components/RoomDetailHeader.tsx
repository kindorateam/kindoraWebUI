import { Tab, Tabs } from '@heroui/react'
import { Avatar } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import Button from './Button'
import Filters from './Filters'
import StudentIcon from './icons/StudentIcon'
import IdentityChip from './IdentityChip'
import LabeledNumberBadge from './LabeledNumberBadge'
import SmileEmoji from '@/components/icons/emojies/SmileEmoji'
import { getRoomById } from '@/services/room.service'

import type { FilterProps } from '@/types/TableFilters'

type TabType = 'students' | 'activity' | 'profile'

interface RoomDetailHeaderProps {
  roomId: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  initialFilters: FilterProps[]
}

const classroomStats = [
  {
    label: 'Capacity',
    value: 30,
  },
  {
    label: 'Students',
    value: 25,
  },
  {
    label: 'Sign In',
    value: 5,
  },
  {
    label: 'Ratio',
    icon: <SmileEmoji />,
  },
]
const staffNames = ['Emily Carter', 'James Whiteker']

const RoomDetailHeader = ({
  activeTab,
  initialFilters,
  roomId,
  onTabChange,
}: RoomDetailHeaderProps) => {
  const { data: room } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getRoomById(roomId),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
    enabled: !!roomId, // Only run query if roomId exists
  })

  const [filters, setFilters] = useState<FilterProps[]>(initialFilters)

  const handleFilterChange = (filterId: string, newValue: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === filterId ? { ...filter, value: newValue } : filter,
      ),
    )
  }

  return (
    <div className="border-b border-[#0000000D]">
      <div className="container max-w-7xl">
        <div className="mb-13 flex">
          <div className="me-7">
            <Avatar className="size-37.5" showFallback />
          </div>
          <div className="w-full">
            <h1 className="mb-3.5 leading-none font-semibold lg:text-[36px]">
              {room?.name ?? `Room ${roomId}`}
            </h1>
            <div className="mb-4 flex items-center">
              <div className="flex flex-wrap gap-4">
                {classroomStats.map((stat) => (
                  <LabeledNumberBadge
                    key={stat.label}
                    label={stat.label}
                    {...(stat.icon
                      ? { icon: stat.icon }
                      : { value: stat.value })}
                  />
                ))}
              </div>
              <Button
                className="ms-auto"
                startContent={<StudentIcon fill="#fff" />}
              >
                Add student
              </Button>
            </div>
            <div className="flex gap-3.5">
              {staffNames.map((name) => (
                <IdentityChip fullName={name} key={name} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Tabs
            aria-label="Room details tabs"
            classNames={{
              // base: 'w-49',
              tabList: 'gap-4',
              cursor: 'w-full',
              tab: 'p-0',
              // tabContent: 'group-data-[selected=true]:text-primary',
            }}
            onSelectionChange={(key) => onTabChange(key as TabType)}
            selectedKey={activeTab}
            variant="underlined"
          >
            <Tab key="students" title="Students" />
            <Tab key="activity" title="Activity" />
            <Tab key="profile" title="Profile" />
          </Tabs>
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>
    </div>
  )
}

export default RoomDetailHeader
