import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Suspense } from 'react'

import PageLoader from '@/components/PageLoader'
import { useRedirectHandler } from '@/hooks/useRedirectHandler'

const RootComponent = () => {
  useRedirectHandler()

  return (
    <div className="bg-fade-cream">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
