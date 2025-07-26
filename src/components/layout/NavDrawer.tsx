import { Badge, Button, Divider } from '@heroui/react'
import { Link, useLocation } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'

import {
  HeartIcon,
  DashboardIcon,
  SchoolIcon,
  MessageIcon,
  BillingIcon,
  AnalyticsIcon,
  ReportsIcon,
  AdmissionsIcon,
  PlusIcon,
} from '@/components/icons'

interface MenuItem {
  label: string
  path: string
  icon?: React.ReactNode
  badge?: number
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  {
    label: 'My school',
    path: '#',
    icon: <SchoolIcon className="h-5 w-5" />,
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
    icon: <MessageIcon className="h-5 w-5" />,
    badge: 5,
    children: [],
  },
  {
    label: 'Billing',
    path: '/billing',
    icon: <BillingIcon className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: <AnalyticsIcon className="h-5 w-5" />,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: <ReportsIcon className="h-5 w-5" />,
  },
  {
    label: 'Admissions',
    path: '/admissions',
    icon: <AdmissionsIcon className="h-5 w-5" />,
  },
]

export const NavDrawer = () => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Check if any child of a menu item is active
  const hasActiveChild = useCallback(
    (item: MenuItem): boolean => {
      if (!item.children) return false
      return item.children.some((child) => location.pathname === child.path)
    },
    [location.pathname],
  )

  // Auto-expand parent if child is active
  useEffect(() => {
    const expanded: string[] = []
    menuItems.forEach((item) => {
      if (hasActiveChild(item)) {
        expanded.push(item.label)
      }
    })
    if (expanded.length > 0) {
      setExpandedItems(expanded)
    }
  }, [hasActiveChild])

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemLabel)
        ? prev.filter((item) => item !== itemLabel)
        : [...prev, itemLabel],
    )
  }

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.label)
    const isActive = location.pathname === item.path
    const isParentActive = hasActiveChild(item)

    if (hasChildren) {
      return (
        <div key={item.label} className="mb-2">
          <button
            onClick={() => toggleExpanded(item.label)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors ${
              isParentActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <Badge
                  color="secondary"
                  size="sm"
                  className="bg-pink-100 text-pink-600"
                >
                  {item.badge}
                </Badge>
              )}
              <svg
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          {isExpanded && (
            <div className="mt-1 ml-12">
              {item.children?.map((child) => {
                const isChildActive = location.pathname === child.path
                return (
                  <Link
                    key={child.label}
                    to={child.path}
                    className={`block rounded-lg px-4 py-2 transition-colors ${
                      isChildActive
                        ? 'bg-gray-100 font-medium text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {child.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.label}
        to={item.path}
        className={`mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
          isActive
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {item.icon}
        <span className="font-medium">{item.label}</span>
        {item.badge && (
          <Badge
            color="secondary"
            size="sm"
            className="ml-auto bg-pink-100 text-pink-600"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <div className="relative h-full bg-gray-50">
      <aside className="flex h-full w-64 flex-col bg-white shadow-lg">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <HeartIcon className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">Kindora</span>
          </div>
        </div>

        <Divider className="my-0" />

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map(renderMenuItem)}
        </nav>
      </aside>

      {/* Floating Action Button */}
      <Button
        isIconOnly
        className="absolute right-8 bottom-8 h-14 w-14 bg-pink-600 shadow-lg hover:bg-pink-700"
        radius="full"
      >
        <PlusIcon className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}
