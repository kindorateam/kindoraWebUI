import { Outlet } from '@tanstack/react-router'

import { NavDrawer } from './'

const MainLayout = () => {
  return (
    <div className="grid grid-cols-[200px_1fr]">
      {/* Navigation Drawer */}
      <NavDrawer />

      {/* Main Content */}
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
