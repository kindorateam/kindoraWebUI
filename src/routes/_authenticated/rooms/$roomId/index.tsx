import { createFileRoute, Navigate } from '@tanstack/react-router'

import RoomActivityTab from '@/components/RoomActivityTab'
import RoomProfileTab from '@/components/RoomProfileTab'
import RoomStudentsTab from '@/components/RoomStudentsTab'

export const Route = createFileRoute('/_authenticated/rooms/$roomId/')({
  component: RoomDetailContent,
})

function RoomDetailContent() {
  // Route hooks return any but are validated by parent route
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const search = Route.useSearch()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const params = Route.useParams()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const tab = search.tab as 'students' | 'activity' | 'profile'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const roomId = params.roomId as string

  // Render content based on active tab
  switch (tab) {
    case 'students':
      return <RoomStudentsTab roomId={roomId} />
    case 'activity':
      return <RoomActivityTab roomId={roomId} />
    case 'profile':
      return <RoomProfileTab roomId={roomId} />
    default:
      // Fallback to students tab if invalid tab
      return (
        <Navigate
          params={{ roomId }}
          replace
          search={{ tab: 'students' }}
          to="/rooms/$roomId"
        />
      )
  }
}
