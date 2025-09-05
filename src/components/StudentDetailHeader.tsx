import { Button, Tab, Tabs } from '@heroui/react'
import { Avatar } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'

import IdentityChip from './IdentityChip'
// import RoomIcon from './RoomIcon'
import { getStudentById } from '@/services/student.service'

type TabType = 'profile' | 'activity' | 'parents'

interface StudentDetailHeaderProps {
  studentId: string
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const StudentDetailHeader = ({
  studentId,
  activeTab,
  onTabChange,
}: StudentDetailHeaderProps) => {
  const { data: student } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
    enabled: !!studentId, // Only run query if studentId exists
  })

  return (
    <div className="border-b border-[#0000000D]">
      <div className="container max-w-7xl">
        <div className="mb-13 flex">
          <div className="me-7">
            <Avatar className="size-37.5" showFallback src={student?.avatar} />
          </div>
          <div className="w-full">
            <h1 className="mb-3.5 leading-none font-semibold lg:text-[36px]">
              {student?.name ?? `Student ${studentId}`}
            </h1>
            <div className="mb-4 flex items-center">
              <Button
                className="bg-wine-700 text-medium ms-auto text-white"
                radius="lg"
              >
                Edit Profile
              </Button>
            </div>
            <div className="flex gap-3.5">
              {student?.parents
                .slice(0, 2)
                .map((parent) => (
                  <IdentityChip
                    fullName={`${parent.name} (${parent.relationship})`}
                    key={parent.id}
                  />
                ))}
            </div>
          </div>
        </div>

        <Tabs
          aria-label="Student details tabs"
          classNames={{
            tabList: 'gap-4',
            cursor: 'w-full',
            tab: 'p-0',
          }}
          onSelectionChange={(key) => onTabChange(key as TabType)}
          selectedKey={activeTab}
          variant="underlined"
        >
          <Tab key="profile" title="Profile" />
          <Tab key="activity" title="Activity" />
          <Tab key="parents" title="Parents" />
        </Tabs>
      </div>
    </div>
  )
}

export default StudentDetailHeader
