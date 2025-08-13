import { useQuery } from '@tanstack/react-query'

import fetchDashboardData from '@/services/dashboard.service'

const useDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}

export default useDashboardQuery
