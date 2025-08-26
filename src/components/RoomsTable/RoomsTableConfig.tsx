import { Avatar } from '@heroui/react'

import RoomIcon from '@/components/RoomIcon'

import type Room from '@/types/room'
import type { TableColumn } from '@/types/table'

const createRoomsColumns = (): TableColumn<Room>[] => [
  {
    key: 'room',
    label: 'Rooms',
    renderCell: (room) => (
      <div className="flex items-center gap-2">
        <RoomIcon roomType={room.icon} />
        <span className="text-sm font-medium">{room.name}</span>
      </div>
    ),
  },
  {
    key: 'capacity',
    label: 'Capacity',
    renderCell: (room) => (
      <span className="text-sm text-gray-600">{room.capacity}</span>
    ),
  },
  {
    key: 'students',
    label: 'Students',
    renderCell: (room) => (
      <span className="text-sm text-gray-600">{room.studentsCount}</span>
    ),
  },
  {
    key: 'staff',
    label: 'Staff',
    renderCell: (room) => (
      <span className="text-sm text-gray-600">{room.staffCount}</span>
    ),
  },
  {
    key: 'signInStudents',
    label: 'Sign in students',
    renderCell: (room) => {
      const { signedInStudents } = room
      const totalStudents = signedInStudents.length

      if (totalStudents === 0) {
        return <span className="text-sm text-gray-400">No students</span>
      }

      const displayCount = Math.min(2, totalStudents)
      const remainingCount = totalStudents - displayCount

      return (
        <div className="flex items-center -space-x-2">
          {signedInStudents.slice(0, displayCount).map((student) => (
            <Avatar
              alt={student.name}
              className="h-8 w-8 border-2 border-white"
              key={student.id}
              showFallback
              src={student.avatar}
            />
          ))}
          {remainingCount > 0 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200">
              <span className="text-xs font-semibold text-gray-700">
                +{remainingCount}
              </span>
            </div>
          )}
          <span className="ml-3 text-sm text-gray-600">({totalStudents})</span>
        </div>
      )
    },
  },
  {
    key: 'signInStaff',
    label: 'Sign in staff',
    renderCell: (room) => {
      const { signedInStaff } = room
      const totalStaff = signedInStaff.length

      if (totalStaff === 0) {
        return <span className="text-sm text-gray-400">No staff</span>
      }

      const displayCount = Math.min(3, totalStaff)

      return (
        <div className="flex items-center -space-x-2">
          {signedInStaff.slice(0, displayCount).map((staff) => (
            <Avatar
              alt={staff.name}
              className="h-8 w-8 border-2 border-white"
              key={staff.id}
              showFallback
              src={staff.avatar}
            />
          ))}
        </div>
      )
    },
  },
]

export default createRoomsColumns
