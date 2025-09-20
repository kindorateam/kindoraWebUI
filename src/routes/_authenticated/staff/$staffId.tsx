import { Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

import { RouteErrorBoundary } from '@/components/error'
import StaffDetailHeader from '@/components/StaffDetailHeader'
import { useTabNavigation } from '@/hooks/useTabNavigation'
import { getStaffMemberById } from '@/services/staff.service'

type TabType = 'profile' | 'documents'

interface StaffDetailSearch {
  tab: TabType
}

export const Route = createFileRoute('/_authenticated/staff/$staffId')({
  component: StaffDetailLayout,
  parseParams: (params) => ({
    staffId: params.staffId,
  }),
  validateSearch: (search: Record<string, unknown>): StaffDetailSearch => {
    const tab = search.tab as string
    const validTabs: TabType[] = ['profile', 'documents']

    return {
      tab: validTabs.includes(tab as TabType) ? (tab as TabType) : 'profile',
    }
  },
  beforeLoad: async ({ params }: { params: { staffId: string } }) => {
    const staff = await getStaffMemberById(params.staffId)

    return {
      breadcrumb: staff?.name ?? `Staff ${params.staffId}`,
    }
  },
})

function StaffDetailLayout() {
  const params = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const staffId = params.staffId
  const tab = search.tab

  const { data: staff } = useQuery({
    queryKey: ['staff', staffId],
    queryFn: () => getStaffMemberById(staffId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!staffId,
  })

  const handleTabChange = useTabNavigation(tab, 'profile', navigate)

  return (
    <RouteErrorBoundary routeName="staff-detail">
      <div>
        <StaffDetailHeader
          pin="1234"
          role="Teacher"
          rooms={['test1', 'test2']}
          staffAvatar={staff?.avatar}
          staffName={staff?.name}
          tabs={
            <Tabs
              aria-label="Staff details tabs"
              classNames={{
                tabList: 'p-0 gap-7',
                cursor: 'w-full bg-brand',
                tab: 'p-0 pb-5',
                tabContent:
                  'group-data-[selected=true]:text-brand text-neutral-700 font-medium',
              }}
              onSelectionChange={(key) => handleTabChange(key as TabType)}
              selectedKey={tab}
              variant="underlined"
            >
              <Tab key="profile" title="Profile" />
              <Tab key="documents" title="Documents" />
            </Tabs>
          }
        />
        <main className="container max-w-4xl pt-10">
          <Outlet />
        </main>
      </div>
    </RouteErrorBoundary>
  )
}
