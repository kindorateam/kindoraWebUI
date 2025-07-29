import { useQuery } from '@tanstack/react-query'

import { studentsService } from '@/services/students.service'

import type { StudentsFilterOptions } from '@/types/student.types'

export const useStudentsQuery = (filters?: StudentsFilterOptions) => {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentsService.fetchStudents(filters),
  })
}

export const useStudentGroupsQuery = (filters?: StudentsFilterOptions) => {
  return useQuery({
    queryKey: ['student-groups', filters],
    queryFn: () => studentsService.fetchStudentGroups(filters),
  })
}
