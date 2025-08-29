import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/students/$studentId/activity',
)({
  component: StudentActivity,
})

function StudentActivity() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <p className="font-medium">Signed in to Baby Turtles room</p>
              <p className="text-sm text-gray-600">Today at 8:30 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="flex-1">
              <p className="font-medium">Completed morning activity</p>
              <p className="text-sm text-gray-600">Today at 9:15 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <div className="flex-1">
              <p className="font-medium">Lunch time</p>
              <p className="text-sm text-gray-600">Today at 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
