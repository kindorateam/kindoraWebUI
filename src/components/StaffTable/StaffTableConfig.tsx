import { Avatar, Button, Chip } from '@heroui/react'

import RoomIcon from '@/components/RoomIcon'

import type Staff from '@/types/staff'
import type { TableColumn } from '@/types/table'

interface StaffTableCellProps {
  staff: Staff
  isPinVisible: (id: string) => boolean
  togglePinVisibility: (id: string) => void
}

const createStaffColumns = ({
  isPinVisible,
  togglePinVisibility,
}: Omit<StaffTableCellProps, 'staff'>): TableColumn<Staff>[] => [
  {
    key: 'staff',
    label: 'Staff',
    renderCell: (staff) => (
      <div className="flex items-center gap-3">
        <Avatar
          alt={staff.name}
          className="h-10 w-10"
          showFallback
          src={staff.avatar}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{staff.name}</span>
          {staff.isCurrentUser && (
            <span className="text-xs text-green-500">My account</span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    renderCell: (staff) => <span className="text-xs">{staff.role}</span>,
  },
  {
    key: 'email',
    label: 'Email',
    renderCell: (staff) => (
      <span className="text-gray2 text-xs">{staff.email}</span>
    ),
  },
  {
    key: 'rooms',
    label: 'Rooms',
    renderCell: () => (
      <div className="text-gray2 flex items-center gap-2">
        <RoomIcon roomType="turtle" />
        <span className="text-xs">Baby turtles</span>
      </div>
    ),
  },
  {
    key: 'pin',
    label: 'Pin',
    renderCell: (staff) => {
      const isVisible = isPinVisible(staff.id)

      if (staff.isCurrentUser) {
        return (
          <Chip
            className="bg-gray-100 p-0! text-gray-800"
            classNames={{
              base: 'p-0!',
              content: 'p-0!',
            }}
            size="sm"
          >
            {staff.pin}
          </Chip>
        )
      }

      return isVisible ? (
        <Chip
          className="cursor-pointer bg-gray-100 p-0! text-gray-800"
          classNames={{
            base: 'p-0!',
            content: 'p-0!',
          }}
          onClick={() => togglePinVisibility(staff.id)}
          size="sm"
        >
          {staff.pin}
        </Chip>
      ) : (
        <Button
          className="text-wine-700 bg-[#792C4133] text-[11px] font-semibold"
          onPress={() => togglePinVisibility(staff.id)}
          size="sm"
        >
          Reveal
        </Button>
      )
    },
  },
]

export default createStaffColumns
