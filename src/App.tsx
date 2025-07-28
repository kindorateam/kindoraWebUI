import { RouterProvider, createRouter } from '@tanstack/react-router'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { routeTree } from './routeTree.gen'
import { authStateAtom, checkAuthAtom } from '@/stores/auth.store'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
  const [, checkAuth] = useAtom(checkAuthAtom)
  const authState = useAtomValue(authStateAtom)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Don't render router until initial auth check is complete
  if (authState.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return <RouterProvider router={router} />
}

export default App
