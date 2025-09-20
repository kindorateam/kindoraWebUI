import { Avatar } from '@heroui/react'

import Button from './Button'
import Chip from './Chip'
import CalendarPlusIcon from './icons/CalendarPlusIcon'
import SignOutIcon from './icons/SignOutIcon'
import IdentityChip from './IdentityChip'
import Text from './Text'

import type { Tag } from '@/types/student'

// import RoomIcon from './RoomIcon'

interface StudentDetailHeaderProps {
  age?: string
  roomName?: string
  studentAvatar?: string
  studentName?: string
  tags?: Tag[]
  tabs: React.ReactNode
}

const StudentDetailHeader = ({
  age,
  roomName,
  studentAvatar,
  studentName,
  tags,
  tabs,
}: StudentDetailHeaderProps) => {
  return (
    <div className="border-b border-[#0000000D]">
      <div className="container max-w-4xl">
        <div className="mb-13 flex items-center">
          <div className="flex items-center gap-7">
            <div>
              <Avatar className="size-37.5" showFallback src={studentAvatar} />
            </div>
            <div className="w-full">
              <Text as="h1" className="mb-1" size={36} weight="bold">
                {studentName}
              </Text>

              <div className="mb-3.5">
                <Text as="span" size={12}>
                  {age}{' '}
                </Text>
                <Text as="span" className="opacity-50" size={12}>
                  5 years
                </Text>
              </div>
              <div className="mb-3 flex gap-2.5">
                {tags?.map((tag) => (
                  <Chip key={tag.id} size="sm">
                    {tag.name}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-3.5">
                <IdentityChip fullName={roomName ?? 'Test Room'} />
              </div>
            </div>
          </div>
          <div className="ms-auto flex gap-3.5">
            <Button
              className="ms-auto"
              color="secondary"
              startContent={<CalendarPlusIcon />}
            >
              Mark absent
            </Button>
            <Button startContent={<SignOutIcon fill="#fff" />}>Sign Out</Button>
          </div>
        </div>

        {tabs}
      </div>
    </div>
  )
}

export default StudentDetailHeader
