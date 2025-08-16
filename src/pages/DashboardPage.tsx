import { Button, Spinner } from '@heroui/react'

import {
  RoomsStatusTable,
  UpcomingWeek,
  NeedsAttention,
  PaymentsCard,
  LoggedActivities,
} from '@/components/features/dashboard'
import StatsCard from '@/components/features/dashboard/StatsCard/StatsCard'
import {
  absentCardData,
  signInCardData,
} from '@/components/features/dashboard/StatsCard/StatsCard.data'
import { SettingsIcon } from '@/components/icons'
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
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="p-[5px] text-4xl text-gray-900">
          Welcome back, <span className="font-bold">{firstName}!</span>
        </h1>
        <Button
          startContent={<SettingsIcon />}
          size="sm"
          variant="flat"
          color="default"
        >
          Customize
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          headerContent={signInCardData.headerData}
          bodyContent={signInCardData.bodyData}
        />
        <StatsCard
          headerContent={absentCardData.headerData}
          bodyContent={absentCardData.bodyData}
        />
      </div>

      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoomsStatusTable rooms={data.roomsStatus} />
          <PaymentsCard payments={data.payments} />
          <LoggedActivities
            categories={data.loggedActivities.categories}
            details={data.loggedActivities.details}
          />
        </div>
        <div>
          <UpcomingWeek events={data.upcomingEvents} />
          <NeedsAttention items={data.needsAttention} />
        </div>
      </div> */}
    </div>
  )
}

export default DashboardPage
