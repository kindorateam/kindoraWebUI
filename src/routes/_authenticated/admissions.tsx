import { createFileRoute } from '@tanstack/react-router'

import PlaceholderPage from '@/components/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/admissions')({
  component: () => <PlaceholderPage name="Admissions" />,
  beforeLoad: () => {
    return {
      breadcrumb: 'Admissions',
    }
  },
})
