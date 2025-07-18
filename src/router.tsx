import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { lazy, Suspense } from 'react'

import { GuestRoute } from '@/components/auth/GuestRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PageLoader } from '@/components/layout/PageLoader'

// Lazy load pages for better performance
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const PokemonDetailPage = lazy(() =>
  import('@/pages/PokemonDetailPage').then((m) => ({
    default: m.PokemonDetailPage,
  })),
)

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Auth layout route (for login, register, etc.)
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_auth',
  component: GuestRoute,
})

const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPage,
})

// Protected layout route
const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  component: ProtectedRoute,
})

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
})

// Pokemon route (public)
const pokemonDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pokemon/$pokemonId',
  component: PokemonDetailPage,
})

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  pokemonDetailRoute,
  authLayoutRoute.addChildren([loginRoute]),
  protectedLayoutRoute.addChildren([dashboardRoute]),
])

// Create router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
