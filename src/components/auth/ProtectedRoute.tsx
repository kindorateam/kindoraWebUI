import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'

import { PageLoader } from '@/components/layout/PageLoader'
import { authStateAtom } from '@/stores/authStore.jotai'

export const ProtectedRoute = () => {
  const authState = useAtomValue(authStateAtom)
  const location = useLocation()
  const navigate = useNavigate()
  const isNavigating = useRef(false)


  useEffect(() => {
    if (
      !authState.isLoading &&
      !authState.isAuthenticated &&
      !isNavigating.current
    ) {
      isNavigating.current = true
      void navigate({
        to: '/login',
        search: { redirect: location.href },
        replace: true,
      })
    }

    // Reset when authenticated
    if (authState.isAuthenticated) {
      isNavigating.current = false
    }
  }, [authState.isLoading, authState.isAuthenticated, navigate, location.href])

  if (authState.isLoading) {
    return <PageLoader />
  }

  if (!authState.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Kindora</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation will be added here */}
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
