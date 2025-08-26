import { createFileRoute } from '@tanstack/react-router'

import RoomsPages from '@/pages/RoomsPage'

export const Route = createFileRoute('/_authenticated/rooms')({
  component: RoomsPages,
  beforeLoad: () => {
    return {
      breadcrumb: 'Rooms',
    }
  },
})
