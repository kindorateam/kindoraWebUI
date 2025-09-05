import { Outlet } from '@tanstack/react-router'

const GuestRoute = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}

export default GuestRoute
