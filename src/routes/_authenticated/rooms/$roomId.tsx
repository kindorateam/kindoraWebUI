import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

import { RouteErrorBoundary } from '@/components/error'
import RoomDetailHeader from '@/components/RoomDetailHeader'
import { useTabNavigation } from '@/hooks/useTabNavigation'
import { getRoomById } from '@/services/room.service'

type TabType = 'students' | 'activity' | 'profile'

interface RoomDetailSearch {
  tab: TabType
}

const roomDetailsFilters = [
  {
    id: 'tagsBy',
    label: 'Tags by',
    value: '',
    options: [
      { value: '', label: 'All Tags' },
      { value: '1-10', label: 'Fast learner' },
      { value: '11-20', label: 'Loves Drawing' },
      { value: '21+', label: 'Good memory' },
    ],
  },
  {
    id: 'statusBy',
    label: 'Status by',
    value: '',
    options: [
      { value: '', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
]

export const Route = createFileRoute('/_authenticated/rooms/$roomId')({
  component: RoomDetailLayout,
  parseParams: (params) => ({
    roomId: params.roomId,
  }),
  validateSearch: (search: Record<string, unknown>): RoomDetailSearch => {
    const tab = search.tab as string
    const validTabs: TabType[] = ['students', 'activity', 'profile']

    return {
      tab: validTabs.includes(tab as TabType) ? (tab as TabType) : 'students',
    }
  },
  beforeLoad: async ({ params }: { params: { roomId: string } }) => {
    const room = await getRoomById(params.roomId)
    return {
      breadcrumb: room?.name ?? `Room ${params.roomId}`,
    }
  },
})

function RoomDetailLayout() {
  // Route hooks return any but are validated by route config
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const params = Route.useParams()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const roomId = params.roomId as string
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const tab = search.tab as TabType

  const handleTabChange = useTabNavigation(tab, 'students', navigate)

  return (
    <RouteErrorBoundary routeName="room-detail">
      <div>
        <RoomDetailHeader
          activeTab={tab}
          initialFilters={roomDetailsFilters}
          onTabChange={handleTabChange}
          roomId={roomId}
        />
        <main className="container max-w-7xl pt-10">
          <Outlet />
        </main>
      </div>
    </RouteErrorBoundary>
  )
}
