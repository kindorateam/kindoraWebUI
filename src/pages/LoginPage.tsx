import { Card, CardBody } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'

import useAuth from '@/hooks/useAuth'
import { getReturnUrlFromLocation } from '@/services/redirect.service'

const LoginPage = () => {
  const { handleGoogleLogin, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Store redirect URL in sessionStorage on component mount
  useEffect(() => {
    const returnUrl = getReturnUrlFromLocation()
    if (returnUrl && returnUrl !== '/login') {
      sessionStorage.setItem('authRedirectUrl', returnUrl)
    }
  }, [])

  // Navigate after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      // First try to get from sessionStorage, then from URL
      const storedUrl = sessionStorage.getItem('authRedirectUrl')
      const urlParam = getReturnUrlFromLocation()
      const returnUrl = storedUrl ?? urlParam

      // Clear the stored URL after using it
      if (storedUrl) {
        sessionStorage.removeItem('authRedirectUrl')
      }

      const destination =
        returnUrl && returnUrl !== '/login' ? returnUrl : '/dashboard'
      void navigate({ to: destination })
    }
  }, [isAuthenticated, navigate])

  const initializeGoogleSignIn = useCallback(() => {
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

  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.accounts) {
      initializeGoogleSignIn()
      return
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    )
    if (existingScript) {
      // Script exists but not loaded yet, wait for it
      existingScript.addEventListener('load', initializeGoogleSignIn)
      return () => {
        existingScript.removeEventListener('load', initializeGoogleSignIn)
      }
    }

    // Load script for the first time
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogleSignIn
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      script.removeEventListener('load', initializeGoogleSignIn)
    }
  }, [initializeGoogleSignIn])

  return (
    <Card className="w-full p-6">
      <CardBody>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <div className="flex justify-center" id="googleSignInButton" />

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

export default LoginPage
