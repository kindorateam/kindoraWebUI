import { Outlet } from '@tanstack/react-router'

const GuestRoute = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Kindora</h1>
          <p className="mt-2 text-sm text-gray-600">
            Kindergarten Management System
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default GuestRoute
