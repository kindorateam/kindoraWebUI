import { Avatar, Chip } from '@heroui/react'

import RoomIcon from '@/components/RoomIcon'

import type Student from '@/types/student'
import type { TableColumn } from '@/types/table'

const createStudentsColumns = (): TableColumn<Student>[] => [
  {
    key: 'student',
    label: 'Students',
    renderCell: (student) => (
      <div className="flex items-center gap-3">
        <Avatar
          alt={student.name}
          className="h-10 w-10"
          showFallback
          src={student.avatar}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{student.name}</span>
          {student.status && (
            <span className="text-xs text-green-500">{student.status}</span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: 'parents',
    label: 'Parents',
    renderCell: (student) => {
      const { parents } = student
      const displayCount = Math.min(2, parents.length)
      const remainingCount = parents.length - displayCount

      if (parents.length === 0) {
        return <span className="text-sm text-gray-400">No parents</span>
      }

      return (
        <div className="flex items-center -space-x-2">
          {parents.slice(0, displayCount).map((parent) => (
            <Avatar
              alt={parent.name}
              className="h-8 w-8 border-2 border-white"
              key={parent.id}
              showFallback
              src={parent.avatar}
            />
          ))}
          {remainingCount > 0 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200">
              <span className="text-xs font-semibold text-gray-700">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    key: 'rooms',
    label: 'Rooms',
    renderCell: (student) => {
      if (student.rooms.length === 0) {
        return <span className="text-sm text-gray-400">No room assigned</span>
      }

      const room = student.rooms[0] // Assuming one primary room per student
      if (!room) {
        return <span className="text-sm text-gray-400">No room assigned</span>
      }

      return (
        <div className="flex items-center gap-2">
          <RoomIcon roomType={room.icon} />
          <span className="text-sm">{room.name}</span>
        </div>
      )
    },
  },
  {
    key: 'tags',
    label: 'Tags',
    renderCell: (student) => {
      const { tags } = student
      const displayCount = Math.min(2, tags.length)
      const remainingCount = tags.length - displayCount

      if (tags.length === 0) {
        return <span className="text-sm text-gray-400">No tags</span>
      }

      return (
        <div className="flex items-center gap-1">
          {tags.slice(0, displayCount).map((tag) => (
            <Chip className={`text-xs ${tag.color}`} key={tag.id} size="sm">
              {tag.name}
            </Chip>
          ))}
          {remainingCount > 0 && (
            <Chip className="bg-gray-100 text-xs text-gray-800" size="sm">
              +{remainingCount}
            </Chip>
          )}
        </div>
      )
    },
  },
]

export default createStudentsColumns
