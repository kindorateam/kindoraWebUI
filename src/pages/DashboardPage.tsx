import { Button, Spinner } from '@heroui/react'

import {
  StatsCard,
  RoomsStatusTable,
  UpcomingWeek,
  NeedsAttention,
  PaymentsCard,
  LoggedActivities,
} from '@/components/features/dashboard'
import useAuth from '@/hooks/useAuth'
import useDashboardQuery from '@/hooks/useDashboardQuery'

const DashboardPage = () => {
  const { user } = useAuth()
  const { data, isLoading, error } = useDashboardQuery()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button color="primary" variant="light" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <Button size="sm" variant="flat" color="default">
          Customize
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          title="Signed in"
          value={data.stats.signedIn.total}
          subValue={`${data.stats.signedIn.morning}`}
          label={`${data.stats.signedIn.afternoon} ${data.stats.signedIn.today}`}
          icon={<div className="h-2 w-2 rounded-full bg-green-500" />}
        />
        <StatsCard
          title="Absentees"
          value={data.stats.absentees.count}
          avatars={data.stats.absentees.children}
          icon={<div className="h-2 w-2 rounded-full bg-orange-500" />}
        />
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white p-4 text-center shadow-sm">
            <div className="mb-1 text-xs text-gray-500">Students</div>
            <div className="text-2xl font-bold">
              {data.stats.counts.students}
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 text-center shadow-sm">
            <div className="mb-1 text-xs text-gray-500">Rooms</div>
            <div className="text-2xl font-bold">{data.stats.counts.rooms}</div>
          </div>
          <div className="rounded-lg bg-white p-4 text-center shadow-sm">
            <div className="mb-1 text-xs text-gray-500">Staff</div>
            <div className="text-2xl font-bold">{data.stats.counts.staff}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RoomsStatusTable rooms={data.roomsStatus} />
          <PaymentsCard payments={data.payments} />
          <LoggedActivities
            categories={data.loggedActivities.categories}
            details={data.loggedActivities.details}
          />
        </div>
        <div className="space-y-6">
          <UpcomingWeek events={data.upcomingEvents} />
          <NeedsAttention items={data.needsAttention} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
