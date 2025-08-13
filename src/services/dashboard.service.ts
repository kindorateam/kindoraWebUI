import { mockDashboardData } from './__mocks__/dashboard.mock'

import type { DashboardData } from '@/types/dashboard.types'

const fetchDashboardData = (): DashboardData => {
  // Mock data for now - replace with actual API call
  // When API is ready, replace with:
  // return apiClient.get<DashboardData>('/dashboard')

  return mockDashboardData
}

export default fetchDashboardData
