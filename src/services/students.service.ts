// import { apiClient } from './api.service'

import type {
  Student,
  StudentGroup,
  StudentsFilterOptions,
} from '@/types/student.types'

export const studentsService = {
  fetchStudents(_filters?: StudentsFilterOptions): Promise<Student[]> {
    // Mock data for now - replace with actual API call
    const mockStudents: Student[] = [
      {
        id: '1',
        firstName: 'James',
        lastName: 'Whitaker',
        room: {
          id: 'baby-turtles',
          name: 'Baby turtles',
          emoji: '🐢',
          color: '#4CAF50',
        },
        parents: [
          { id: '1', firstName: 'John', lastName: 'Whitaker' },
          { id: '2', firstName: 'Jane', lastName: 'Whitaker' },
        ],
        tags: [
          { id: '1', label: 'Fast learner' },
          { id: '2', label: 'Good memory' },
        ],
        status: 'active',
      },
      {
        id: '2',
        firstName: 'Emma',
        lastName: 'Johnson',
        room: {
          id: 'baby-turtles',
          name: 'Baby turtles',
          emoji: '🐢',
          color: '#4CAF50',
        },
        parents: [
          { id: '3', firstName: 'Mike', lastName: 'Johnson' },
          { id: '4', firstName: 'Sarah', lastName: 'Johnson' },
        ],
        tags: [{ id: '1', label: 'Fast learner' }],
        status: 'active',
      },
      {
        id: '3',
        firstName: 'Oliver',
        lastName: 'Smith',
        room: {
          id: 'baby-turtles',
          name: 'Baby turtles',
          emoji: '🐢',
          color: '#4CAF50',
        },
        parents: [{ id: '5', firstName: 'David', lastName: 'Smith' }],
        tags: [
          { id: '1', label: 'Fast learner' },
          { id: '2', label: 'Good memory' },
        ],
        status: 'active',
      },
      {
        id: '4',
        firstName: 'Sophia',
        lastName: 'Brown',
        room: {
          id: 'baby-turtles',
          name: 'Baby turtles',
          emoji: '🐢',
          color: '#4CAF50',
        },
        parents: [
          { id: '6', firstName: 'Robert', lastName: 'Brown' },
          { id: '7', firstName: 'Lisa', lastName: 'Brown' },
        ],
        tags: [{ id: '2', label: 'Good memory' }],
        status: 'vacation',
      },
      {
        id: '5',
        firstName: 'Lucas',
        lastName: 'Davis',
        room: {
          id: 'baby-turtles',
          name: 'Baby turtles',
          emoji: '🐢',
          color: '#4CAF50',
        },
        parents: [{ id: '8', firstName: 'William', lastName: 'Davis' }],
        tags: [{ id: '1', label: 'Fast learner' }],
        status: 'active',
      },
    ]

    // When API is ready, replace with:
    // return apiClient.get<Student[]>('/students', { params: filters })

    return Promise.resolve(mockStudents)
  },

  async fetchStudentGroups(
    filters?: StudentsFilterOptions,
  ): Promise<StudentGroup[]> {
    const students = await this.fetchStudents(filters)

    // Group students by room
    const groupsMap = new Map<string, StudentGroup>()

    students.forEach((student) => {
      const roomId = student.room.id
      if (!groupsMap.has(roomId)) {
        groupsMap.set(roomId, {
          room: student.room,
          students: [],
          isExpanded: true, // default to expanded
        })
      }
      groupsMap.get(roomId)!.students.push(student)
    })

    return Array.from(groupsMap.values())
  },
}
