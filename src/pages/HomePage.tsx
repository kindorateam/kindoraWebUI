import { Button } from '@heroui/react'
import { Link, Navigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'

import PageLoader from '@/components/PageLoader'
import { authStateAtom } from '@/stores/auth.store.ts'

const HomePage = () => {
  const authState = useAtomValue(authStateAtom)

  if (authState.isLoading) {
    return <PageLoader />
  }

  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Kindora</h1>
        <p className="text-lg text-gray-600">Kindergarten Management System</p>
        <Button as={Link} color="primary" size="lg" to="/login">
          Get Started
        </Button>
      </div>
    </div>
  )
}

export default HomePage
