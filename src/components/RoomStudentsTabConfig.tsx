import { Avatar, Chip } from '@heroui/react'

import type { TableColumn } from '@/types/table'

interface Student {
  id: string
  name: string
  avatar?: string
  parents: {
    id: string
    name: string
    avatar?: string
  }[]
  tags: string[]
}

const createStudentColumns = (): TableColumn<Student>[] => [
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
        </div>
      </div>
    ),
  },
  {
    key: 'parents',
    label: 'Parents',
    renderCell: (student) => {
      const { parents } = student
      const totalParents = parents.length

      if (totalParents === 0) {
        return <span className="text-sm text-gray-400">No parents</span>
      }

      const displayCount = Math.min(2, totalParents)

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
        </div>
      )
    },
  },
  {
    key: 'tags',
    label: 'Tags',
    renderCell: (student) => {
      const { tags } = student

      if (tags.length === 0) {
        return <span className="text-sm text-gray-400">No tags</span>
      }

      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <Chip
              className="bg-blue-50 text-xs text-blue-700"
              key={index}
              size="sm"
            >
              {tag}
            </Chip>
          ))}
        </div>
      )
    },
  },
]

export default createStudentColumns
export type { Student }
