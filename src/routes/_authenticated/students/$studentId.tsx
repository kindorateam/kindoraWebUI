import { Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

import { RouteErrorBoundary } from '@/components/error'
import StudentDetailHeader from '@/components/StudentDetailHeader'
import { useTabNavigation } from '@/hooks/useTabNavigation'
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
  const params = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const studentId = params.studentId
  const tab = search.tab

  const { data: student } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
    enabled: !!studentId, // Only run query if studentId exists
  })
  console.log(student)

  const handleTabChange = useTabNavigation(tab, 'activity', navigate)

  return (
    <RouteErrorBoundary routeName="student-detail">
      <div>
        <StudentDetailHeader
          age={student?.dob ?? '1 year'}
          roomName={student?.rooms[0]?.name ?? 'No Room Assigned'}
          studentAvatar={student?.avatar}
          studentName={student?.name}
          tabs={
            <Tabs
              aria-label="Student details tabs"
              classNames={{
                tabList: 'gap-4',
                cursor: 'w-full',
                tab: 'p-0',
              }}
              onSelectionChange={(key) => handleTabChange(key as TabType)}
              selectedKey={tab}
              variant="underlined"
            >
              <Tab key="activity" title="Activity" />
              <Tab key="profile" title="Profile" />
              <Tab key="documents" title="Documents" />
              <Tab key="immunization" title="Immunization" />
              <Tab key="billing" title="Billing" />
            </Tabs>
          }
          tags={student?.tags}
        />
        <main className="container max-w-7xl pt-10">
          <Outlet />
        </main>
      </div>
    </RouteErrorBoundary>
  )
}
