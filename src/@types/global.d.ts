import type { GoogleAuthResponse } from '@/types/auth.types'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleAuthResponse) => void
          }) => void
          renderButton: (
            element: HTMLElement,
            options: {
              theme: string
              size: string
              type: string
              shape: string
            },
          ) => void
          prompt: () => void
        }
      }
    }
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
