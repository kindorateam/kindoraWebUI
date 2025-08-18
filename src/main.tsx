import { HeroUIProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App'
import { ErrorBoundary } from './components/error'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary
      level="root"
      onError={(error, errorInfo) => {
        // In production, you might want to send this to an error tracking service
        console.error('Root Application Error:', error, errorInfo)
      }}
    >
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <HeroUIProvider>
            <App />
          </HeroUIProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </ErrorBoundary>
  </StrictMode>,
)
