import { createFileRoute } from '@tanstack/react-router'

import RoomsPage from '@/pages/RoomsPage'

export const Route = createFileRoute('/_authenticated/rooms/')({
  component: RoomsPage,
  beforeLoad: () => {
    return {
      breadcrumb: 'Rooms',
    }
  },
})
