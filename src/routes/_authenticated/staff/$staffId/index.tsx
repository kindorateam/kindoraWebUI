import { createFileRoute } from '@tanstack/react-router'

import StaffProfileTab from '@/components/StaffProfileTab'

export const Route = createFileRoute('/_authenticated/staff/$staffId/')({
  component: StaffDetailIndex,
})

function StaffDetailIndex() {
  const search = Route.useSearch()

  const tab = (search as Record<string, unknown>).tab as string | undefined

  if (tab === 'profile') {
    return <StaffProfileTab />
  }
  if (tab === 'documents') {
    return <div className="text-default-500">Documents coming soon…</div>
  }

  return <StaffProfileTab />
}
