import { createFileRoute, Navigate } from '@tanstack/react-router'

import StudentActivityTab from '@/components/StudentActivityTab'

export const Route = createFileRoute('/_authenticated/students/$studentId/')({
  component: StudentDetailIndex,
})

function StudentDetailIndex() {
  const params = Route.useParams()
  const search = Route.useSearch()

  const studentId = params.studentId
  const tab = search.tab

  switch (tab) {
    case 'activity':
      return <StudentActivityTab />
    case 'profile':
      return (
        <Navigate
          params={{ studentId }}
          replace
          search={{ tab: 'profile' }}
          to="/students/$studentId"
        />
      )
    case 'documents':
      return (
        <Navigate
          params={{ studentId }}
          replace
          search={{ tab: 'documents' }}
          to="/students/$studentId"
        />
      )
    case 'immunization':
      return (
        <Navigate
          params={{ studentId }}
          replace
          search={{ tab: 'immunization' }}
          to="/students/$studentId"
        />
      )
    case 'billing':
      return (
        <Navigate
          params={{ studentId }}
          replace
          search={{ tab: 'billing' }}
          to="/students/$studentId"
        />
      )
    default:
      return (
        <Navigate
          params={{ studentId }}
          replace
          search={{ tab: 'activity' }}
          to="/students/$studentId"
        />
      )
  }
}
