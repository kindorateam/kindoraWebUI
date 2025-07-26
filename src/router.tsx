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
import { RouteErrorBoundary } from '@/components/error'
import { PageLoader, PlaceholderPage } from '@/components/layout'

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
  component: () => (
    <RouteErrorBoundary routeName="home">
      <HomePage />
    </RouteErrorBoundary>
  ),
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
  component: () => (
    <RouteErrorBoundary routeName="login">
      <LoginPage />
    </RouteErrorBoundary>
  ),
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
  component: () => (
    <RouteErrorBoundary routeName="dashboard">
      <DashboardPage />
    </RouteErrorBoundary>
  ),
})

// Additional protected routes
const insightsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/insights',
  component: () => <PlaceholderPage name="Insights" />,
})

const studentsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/students',
  component: () => <PlaceholderPage name="Students" />,
})

const roomsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/rooms',
  component: () => <PlaceholderPage name="Rooms" />,
})

const staffRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/staff',
  component: () => <PlaceholderPage name="Staff" />,
})

const calendarRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/calendar',
  component: () => <PlaceholderPage name="Calendar" />,
})

const newsActivityRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/news-activity',
  component: () => <PlaceholderPage name="News Activity" />,
})

const billingRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/billing',
  component: () => <PlaceholderPage name="Billing" />,
})

const analyticsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/analytics',
  component: () => <PlaceholderPage name="Analytics" />,
})

const reportsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/reports',
  component: () => <PlaceholderPage name="Reports" />,
})

const admissionsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/admissions',
  component: () => <PlaceholderPage name="Admissions" />,
})

// Pokemon route (public)
const pokemonDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pokemon/$pokemonId',
  component: () => (
    <RouteErrorBoundary routeName="pokemon-detail">
      <PokemonDetailPage />
    </RouteErrorBoundary>
  ),
})

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  pokemonDetailRoute,
  authLayoutRoute.addChildren([loginRoute]),
  protectedLayoutRoute.addChildren([
    dashboardRoute,
    insightsRoute,
    studentsRoute,
    roomsRoute,
    staffRoute,
    calendarRoute,
    newsActivityRoute,
    billingRoute,
    analyticsRoute,
    reportsRoute,
    admissionsRoute,
  ]),
])

// Create router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})
