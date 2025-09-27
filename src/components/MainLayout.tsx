import { Outlet } from '@tanstack/react-router'

import AppDrawer from './drawers/AppDrawer'
import Header from './Header'
import NavDrawer from './NavDrawer'

const MainLayout = () => {
  return (
    <>
      <div className="grid grid-cols-[200px_1fr]">
        <NavDrawer />

        <div>
          <Header />
          <Outlet />
        </div>
      </div>
      <AppDrawer />
    </>
  )
}

export default MainLayout
