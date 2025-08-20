import { useCallback, useState } from 'react'

import type { PinVisibility } from '@/types/staff.types'

const usePinVisibility = () => {
  const [pinVisibility, setPinVisibility] = useState<PinVisibility>({})

  const togglePinVisibility = useCallback((staffId: string) => {
    setPinVisibility((prev) => ({
      ...prev,
      [staffId]: !prev[staffId],
    }))
  }, [])

  const isPinVisible = useCallback(
    (staffId: string): boolean => {
      return pinVisibility[staffId] ?? false
    },
    [pinVisibility],
  )

  const hidePinForStaff = useCallback((staffId: string) => {
    setPinVisibility((prev) => ({
      ...prev,
      [staffId]: false,
    }))
  }, [])

  const showPinForStaff = useCallback((staffId: string) => {
    setPinVisibility((prev) => ({
      ...prev,
      [staffId]: true,
    }))
  }, [])

  return {
    isPinVisible,
    togglePinVisibility,
    hidePinForStaff,
    showPinForStaff,
  }
}

export default usePinVisibility
