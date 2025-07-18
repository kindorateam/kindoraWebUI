import { Card, CardBody } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'

import { useAuth } from '@/hooks/useAuth'

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

export function LoginPage() {
  const { handleGoogleLogin, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Navigate to dashboard after successful authentication
  React.useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const initializeGoogleSignIn = React.useCallback(() => {
    if (window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      })

      const buttonDiv = document.getElementById('googleSignInButton')
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
        })
      }
    }
  }, [handleGoogleLogin])

  React.useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        initializeGoogleSignIn()
      }
      document.head.appendChild(script)
    }

    loadGoogleScript()
  }, [initializeGoogleSignIn])

  return (
    <Card className="w-full p-6">
      <CardBody className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div id="googleSignInButton" className="flex justify-center" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with Google
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardBody>
    </Card>
  )
}
