import { createFileRoute } from '@tanstack/react-router'

import PlaceholderPage from '@/components/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/newsletters')({
  component: () => <PlaceholderPage name="Newsletters" />,
  beforeLoad: () => {
    return {
      breadcrumb: 'Newsletters',
    }
  },
})
