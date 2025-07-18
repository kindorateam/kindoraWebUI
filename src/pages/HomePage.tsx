import { Button } from '@heroui/react'
import { Navigate, Link } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'

import { PokemonDemo, UsersTable } from '@/components'
import { PageLoader } from '@/components/layout/PageLoader'
import { authStateAtom } from '@/stores/authStore.jotai'

export function HomePage() {
  const authState = useAtomValue(authStateAtom)

  // Wait for auth state to be loaded before checking authentication
  if (authState.isLoading) {
    return <PageLoader />
  }

  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Kindora</h1>
        <p className="text-lg text-gray-600">Kindergarten Management System</p>
        <Button as={Link} to="/login" color="primary" size="lg">
          Get Started
        </Button>
      </div>

      <div className="w-full max-w-6xl">
        <PokemonDemo />

        <div className="mt-12">
          <UsersTable />
        </div>
      </div>
    </div>
  )
}
