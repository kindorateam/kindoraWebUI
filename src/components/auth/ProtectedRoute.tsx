import { useLocation, useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'

import { MainLayout, PageLoader } from '@/components/layout'
import { authStateAtom } from '@/stores/auth.store'

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

  return <MainLayout />
}
