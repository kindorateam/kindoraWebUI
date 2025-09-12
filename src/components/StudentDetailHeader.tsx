import { Chip } from '@heroui/react'
import { Avatar } from '@heroui/react'

import Button from './Button'
import IdentityChip from './IdentityChip'

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
      <div className="container max-w-7xl">
        <div className="mb-13 flex items-center">
          <div className="flex items-center">
            <div className="me-7">
              <Avatar className="size-37.5" showFallback src={studentAvatar} />
            </div>
            <div className="w-full">
              <h1 className="mb-1 leading-none font-semibold lg:text-[36px]">
                {studentName}
              </h1>
              <p className="mb-3">{age}</p>
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
          <div className="ms-auto">
            <Button className="ms-auto" color="secondary">
              Mark absent
            </Button>
            <Button className="ms-3.5">Sign Out</Button>
          </div>
        </div>

        {tabs}
      </div>
    </div>
  )
}

export default StudentDetailHeader
