import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import {
  clearPendingRedirect,
  getPendingRedirect,
} from '@/services/redirect.service'

export const useRedirectHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkPendingRedirect = () => {
      const pendingRedirect = getPendingRedirect()

      if (pendingRedirect) {
        clearPendingRedirect()

        void navigate({
          to: pendingRedirect.url,
          replace: pendingRedirect.options?.replace ?? true,
        })
      }
    }

    checkPendingRedirect()

    const interval = setInterval(checkPendingRedirect, 100)

    return () => clearInterval(interval)
  }, [navigate])
}
