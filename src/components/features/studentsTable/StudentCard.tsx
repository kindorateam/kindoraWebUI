import { Avatar, Button } from '@heroui/react'

import { EyeIcon, EditIcon } from '@/components/icons'

import type { Student } from '@/types'

interface StudentCardProps {
  student: Student
}

const getStatusColor = (status: Student['status']) => {
  switch (status) {
    case 'vacation':
      return 'bg-[#792c41] bg-opacity-20 text-[#792c41]'
    case 'sick':
      return 'bg-[#792c41] bg-opacity-20 text-[#792c41]'
    case 'inactive':
      return 'bg-gray-400 bg-opacity-20 text-gray-600'
    default:
      return ''
  }
}

const getStatusLabel = (status: Student['status']) => {
  switch (status) {
    case 'vacation':
      return 'Vacation'
    case 'sick':
      return 'Sick'
    case 'inactive':
      return 'Inactive'
    default:
      return null
  }
}

const StudentCard = ({ student }: StudentCardProps) => {
  const statusLabel = getStatusLabel(student.status)
  const statusColor = getStatusColor(student.status)

  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-4">
      {/* Student Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={student.avatar}
            alt={`${student.firstName} ${student.lastName}`}
            className="h-9 w-9"
          />
          {student.status === 'active' && (
            <div className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-green-500" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {student.firstName} {student.lastName}
          </h3>
        </div>
      </div>

      {/* Parents */}
      <div className="flex items-center gap-2">
        {student.parents.slice(0, 2).map((parent, index) => (
          <Avatar
            key={parent.id}
            src={parent.avatar}
            alt={`${parent.firstName} ${parent.lastName}`}
            className={`h-6 w-6 ${index > 0 ? '-ml-2' : ''}`}
          />
        ))}
        {student.parents.length > 2 && (
          <span className="text-xs text-gray-500">
            +{student.parents.length - 2}
          </span>
        )}
      </div>

      {/* Room */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          <span className="text-sm">{student.room.emoji}</span>
        </div>
        <span className="text-xs text-gray-500">{student.room.name}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {student.tags.slice(0, 2).map((tag) => (
          <span key={tag.id} className="text-xs text-gray-500">
            {tag.label}
          </span>
        ))}
        {student.tags.length > 2 && (
          <span className="text-xs text-gray-400">...</span>
        )}
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-3">
        {statusLabel && (
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}
          >
            {statusLabel}
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>

          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </div>

        {statusLabel && (
          <Button
            size="sm"
            className="bg-[#792c41] text-white hover:bg-[#6a2537]"
          >
            Sign out
          </Button>
        )}
      </div>
    </div>
  )
}

export default StudentCard
