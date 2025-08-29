import { Outlet } from '@tanstack/react-router'

import Header from './Header'
import NavDrawer from './NavDrawer'

const MainLayout = () => {
  return (
    <div className="grid grid-cols-[200px_1fr]">
      <NavDrawer />

      <div>
        <Header />
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
