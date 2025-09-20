import { Avatar } from '@heroui/react'

import Button from './Button'
import Chip from './Chip'
import CalendarPlusIcon from './icons/CalendarPlusIcon'
import SignOutIcon from './icons/SignOutIcon'
import IdentityChip from './IdentityChip'
import Text from './Text'

interface StaffDetailHeaderProps {
  pin?: string
  role?: string
  rooms?: string[]
  staffAvatar?: string
  staffName?: string
  tabs: React.ReactNode
}

const StaffDetailHeader = ({
  pin,
  role,
  rooms = [],
  staffName,
  staffAvatar,
  tabs,
}: StaffDetailHeaderProps) => {
  return (
    <div className="border-b border-[#0000000D]">
      <div className="container max-w-4xl">
        <div className="mb-13 flex items-center">
          <div className="flex items-center gap-7">
            <div>
              <Avatar className="size-37.5" showFallback src={staffAvatar} />
            </div>
            <div className="w-full">
              <Text as="h1" className="mb-4" size={36} weight="bold">
                {staffName ?? 'Staff Member'}
              </Text>

              <div className="mb-5 flex flex-wrap gap-5">
                {role ? (
                  <div className="flex items-center gap-2">
                    <Text color="neutral-800" size={12}>
                      Role
                    </Text>
                    <Chip className="text-xs font-semibold">{role}</Chip>
                  </div>
                ) : null}
                {pin ? (
                  <div className="flex items-center gap-2">
                    <Text color="neutral-800" size={12}>
                      Pin
                    </Text>
                    <Chip className="text-xs font-semibold">{pin}</Chip>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3.5">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <IdentityChip fullName={room} key={room} />
                  ))
                ) : (
                  <Chip className="text-xs" size="sm">
                    No room assigned
                  </Chip>
                )}
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

export default StaffDetailHeader
