import { Button } from '@heroui/react'
import { useState } from 'react'

import StudentCard from './StudentCard'

import type { StudentGroup as StudentGroupType } from '@/types'

interface StudentGroupProps {
  group: StudentGroupType
}

const StudentGroup = ({ group }: StudentGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(group.isExpanded)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="mb-4 flex items-center gap-3">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="h-6 w-6 min-w-6 text-gray-500"
          onPress={toggleExpanded}
        >
          <svg
            className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>

        <h2 className="text-lg font-medium text-gray-700">{group.room.name}</h2>

        <span className="text-lg font-light text-gray-400">
          {group.students.length}
        </span>
      </div>

      {/* Divider Line */}
      <div className="mb-4 h-px bg-gray-200" />

      {/* Students List */}
      {isExpanded && (
        <div className="space-y-2">
          {group.students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentGroup
