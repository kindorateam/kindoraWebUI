import { Avatar } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { getStudentById } from '@/services/student.service'

export const Route = createFileRoute(
  '/_authenticated/students/$studentId/parents',
)({
  component: StudentParents,
})

function StudentParents() {
  const params = Route.useParams()

  const studentId = params.studentId
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Student not found
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Parent Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {student.parents.map((parent) => (
            <div className="rounded-lg border p-4" key={parent.id}>
              <div className="flex items-center gap-4">
                <Avatar
                  alt={parent.name}
                  className="h-12 w-12"
                  showFallback
                  src={parent.avatar}
                />
                <div>
                  <h3 className="font-semibold">{parent.name}</h3>
                  <p className="text-sm text-gray-600">{parent.relationship}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-sm">
                    {parent.name.toLowerCase().replace(' ', '.')}@example.com
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
