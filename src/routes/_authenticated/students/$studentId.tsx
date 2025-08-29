import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'

import { RouteErrorBoundary } from '@/components/error'
import StudentDetailHeader from '@/components/StudentDetailHeader'
import { getStudentById } from '@/services/student.service'

type TabType = 'profile' | 'activity' | 'parents'

interface StudentDetailSearch {
  tab: TabType
}

export const Route = createFileRoute('/_authenticated/students/$studentId')({
  component: StudentDetailLayout,
  parseParams: (params) => ({
    studentId: params.studentId,
  }),
  validateSearch: (search: Record<string, unknown>): StudentDetailSearch => {
    const tab = search.tab as string
    const validTabs: TabType[] = ['profile', 'activity', 'parents']

    return {
      tab: validTabs.includes(tab as TabType) ? (tab as TabType) : 'profile',
    }
  },
  beforeLoad: async ({ params }: { params: { studentId: string } }) => {
    const student = await getStudentById(params.studentId)
    return {
      breadcrumb: student?.name ?? `Student ${params.studentId}`,
    }
  },
})

function StudentDetailLayout() {
  // Route hooks return any but are validated by route config
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const params = Route.useParams()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const studentId = params.studentId as string
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const tab = search.tab as TabType

  // Redirect to profile tab if no tab is specified
  useEffect(() => {
    if (!tab) {
      void navigate({
        search: { tab: 'profile' },
        replace: true,
      })
    }
  }, [tab, navigate])

  const handleTabChange = useCallback(
    (newTab: TabType) => {
      void navigate({
        search: { tab: newTab },
        replace: true,
      })
    },
    [navigate],
  )

  return (
    <RouteErrorBoundary routeName="student-detail">
      <div>
        <StudentDetailHeader
          activeTab={tab}
          onTabChange={handleTabChange}
          studentId={studentId}
        />
        <main className="container max-w-7xl pt-10">
          <Outlet />
        </main>
      </div>
    </RouteErrorBoundary>
  )
}
