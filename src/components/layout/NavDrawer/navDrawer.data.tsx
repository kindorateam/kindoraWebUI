import {
  AdmissionsIcon,
  AnalyticsIcon,
  BillingIcon,
  DashboardIcon,
  MessageIcon,
  ReportsIcon,
  SchoolIcon,
} from '@/components/icons'

import type { NavDrawerItem } from './navDrawer.types'

const navDrawerData: NavDrawerItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'My school',
    path: '#',
    icon: <SchoolIcon />,
    children: [
      { label: 'Insights', path: '/insights' },
      { label: 'Students', path: '/students' },
      { label: 'Rooms', path: '/rooms' },
      { label: 'Staff', path: '/staff' },
      { label: 'Calendar', path: '/calendar' },
      { label: 'News activity', path: '/news-activity' },
    ],
  },
  {
    label: 'Connections',
    path: '#',
    icon: <MessageIcon />,
    badge: 5,
    children: [],
  },
  {
    label: 'Billing',
    path: '/billing',
    icon: <BillingIcon />,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: <AnalyticsIcon />,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: <ReportsIcon />,
  },
  {
    label: 'Admissions',
    path: '/admissions',
    icon: <AdmissionsIcon />,
  },
]

export default navDrawerData
