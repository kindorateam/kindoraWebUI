// import { apiClient } from './api.service'

import { mockStudents } from './__mocks__/students.mock'

import type {
  Student,
  StudentGroup,
  StudentsFilterOptions,
} from '@/types/student.types'

export const studentsService = {
  fetchStudents(_filters?: StudentsFilterOptions): Promise<Student[]> {
    // Mock data for now - replace with actual API call
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
