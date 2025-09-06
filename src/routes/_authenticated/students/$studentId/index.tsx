import { createFileRoute } from '@tanstack/react-router'

import StudentActivityTab from '@/components/StudentActivityTab'

export const Route = createFileRoute('/_authenticated/students/$studentId/')({
  component: StudentDetailIndex,
})

function StudentDetailIndex() {
  const search = Route.useSearch()

  const tab = (search as Record<string, unknown>).tab as string | undefined

  if (!tab || tab === 'activity') {
    return <StudentActivityTab />
  }

  if (tab === 'profile') {
    return <div className="text-default-500">Profile coming soon…</div>
  }
  if (tab === 'documents') {
    return <div className="text-default-500">Documents coming soon…</div>
  }
  if (tab === 'immunization') {
    return <div className="text-default-500">Immunization coming soon…</div>
  }
  if (tab === 'billing') {
    return <div className="text-default-500">Billing coming soon…</div>
  }

  return <StudentActivityTab />
}
