import { RouterProvider } from '@tanstack/react-router'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { router } from './router'
import { authStateAtom, checkAuthAtom } from '@/stores'

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
