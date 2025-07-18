import { Card, CardBody, CardHeader, Avatar, Button } from '@heroui/react'

import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button color="danger" variant="light" onPress={logout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-0">
            <h2 className="text-lg font-semibold">Welcome</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center space-x-3">
              <Avatar src={user?.picture} name={user?.name} size="lg" />
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <h2 className="text-lg font-semibold">Children</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-500">Active children</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <h2 className="text-lg font-semibold">Activities</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-500">Today&apos;s activities</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button color="primary" variant="flat">
              Add Child
            </Button>
            <Button color="secondary" variant="flat">
              Schedule Activity
            </Button>
            <Button color="success" variant="flat">
              Send Message
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
