import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'

import { RouteErrorBoundary } from '@/components/error'
import RoomDetailSubHeader from '@/components/RoomDetailSubHeader'
import { getRoomById } from '@/services/room.service'

type TabType = 'students' | 'activity' | 'profile'

interface RoomDetailSearch {
  tab: TabType
}

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
  beforeLoad: async ({ params }) => {
    const room = await getRoomById(params.roomId)
    return {
      breadcrumb: `Rooms / ${room?.name ?? `Room ${params.roomId}`}`,
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

  // Redirect to students tab if no tab is specified
  useEffect(() => {
    if (!tab) {
      void navigate({
        search: { tab: 'students' },
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
    <RouteErrorBoundary routeName="room-detail">
      <div>
        <RoomDetailSubHeader
          activeTab={tab}
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
