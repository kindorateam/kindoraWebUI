import { Outlet, useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'

import { authStateAtom } from '@/stores/authStore.jotai'

export const GuestRoute = () => {
  const authState = useAtomValue(authStateAtom)
  const navigate = useNavigate()
  const isNavigating = useRef(false)

  useEffect(() => {
    if (
      !authState.isLoading &&
      authState.isAuthenticated &&
      !isNavigating.current
    ) {
      isNavigating.current = true
      void navigate({ to: '/', replace: true })
    }

    // Reset when not authenticated
    if (!authState.isAuthenticated) {
      isNavigating.current = false
    }
  }, [authState.isLoading, authState.isAuthenticated, navigate])

  if (authState.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (authState.isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
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
