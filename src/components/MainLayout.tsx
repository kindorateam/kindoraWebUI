import { Outlet } from '@tanstack/react-router'

import Header from './Header'
import NavDrawer from './NavDrawer'

const MainLayout = () => {
  return (
    <div className="grid grid-cols-[200px_1fr]">
      <NavDrawer />

      <div>
        <Header />

        <main className="container max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
