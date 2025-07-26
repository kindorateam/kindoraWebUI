import { RouterProvider } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { router } from './router'
import { checkAuthAtom } from '@/stores/auth.store'

const App = () => {
  const [, checkAuth] = useAtom(checkAuthAtom)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return <RouterProvider router={router} />
}

export default App
