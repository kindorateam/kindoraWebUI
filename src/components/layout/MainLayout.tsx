import { Outlet } from '@tanstack/react-router'

import { NavDrawer } from './NavDrawer'

export const MainLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Navigation Drawer */}
      <NavDrawer />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
