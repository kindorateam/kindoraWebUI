import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { getStudentById } from '@/services/student.service'

export const Route = createFileRoute(
  '/_authenticated/students/$studentId/profile',
)({
  component: StudentProfile,
})

function StudentProfile() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const params = Route.useParams()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const studentId = params.studentId as string
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
        <h2 className="mb-4 text-xl font-semibold">Student Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg">{student.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="text-lg">{student.status ?? 'Active'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Room</label>
            <p className="text-lg">
              {student.rooms[0]?.name ?? 'Not assigned'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Tags</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {student.tags.map((tag) => (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tag.color}`}
                  key={tag.id}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
