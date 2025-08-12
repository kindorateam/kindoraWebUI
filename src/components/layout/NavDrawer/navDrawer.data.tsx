import AdmissionsIcon from '@/assets/svg/admissionsIcon.svg?no-inline'
import AnalyticsIcon from '@/assets/svg/analyticsIcon.svg?no-inline'
import BillingIcon from '@/assets/svg/billingIcon.svg?no-inline'
import DashboardIcon from '@/assets/svg/dashboardIcon.svg?no-inline'
import MessageIcon from '@/assets/svg/messagesIcon.svg?no-inline'
import ReportsIcon from '@/assets/svg/reportsIcon.svg?no-inline'
import SchoolIcon from '@/assets/svg/schoolIcon.svg?no-inline'

import type { NavDrawerItem } from './navDrawer.types'

const navDrawerData: NavDrawerItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <img src={DashboardIcon} alt="" />,
  },
  {
    label: 'My school',
    path: '#',
    icon: <img src={SchoolIcon} alt="" />,
    badge: 5,
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
    label: 'Messages',
    path: '#',
    icon: <img src={MessageIcon} alt="" />,
    badge: 5,
    children: [],
  },
  {
    label: 'Billing',
    path: '/billing',
    icon: <img src={BillingIcon} alt="" />,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: <img src={AnalyticsIcon} alt="" />,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: <img src={ReportsIcon} alt="" />,
  },
  {
    label: 'Admissions',
    path: '/admissions',
    icon: <img src={AdmissionsIcon} alt="" />,
  },
]

export default navDrawerData
