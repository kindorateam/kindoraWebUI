import { Button, Spinner } from '@heroui/react'

// import {
//   RoomsStatusTable,
//   UpcomingWeek,
//   NeedsAttention,
//   PaymentsCard,
//   LoggedActivities,
// } from '@/components/features/dashboard'
import SettingsIcon from '@/components/icons/SettingsIcon'
import StatsCard from '@/components/StatsCard/StatsCard'
import {
  absentCardData,
  signInCardData,
} from '@/components/StatsCard/StatsCard.data'
import useAuth from '@/hooks/useAuth'

const DashboardPage = () => {
  const { user } = useAuth()

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return <div>123321</div>
}

export default DashboardPage
