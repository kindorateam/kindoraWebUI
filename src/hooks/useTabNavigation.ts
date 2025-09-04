import { useCallback, useEffect } from 'react'

/**
 * Custom hook for handling tab navigation in detail pages.
 * Manages redirect to default tab if no tab is specified and provides a handler for tab changes.
 * @param currentTab - The current active tab
 * @param defaultTab - The default tab to redirect to if no tab is specified
 * @param navigate - The navigate function from TanStack Router
 * @returns handleTabChange - Function to change the tab
 */
export function useTabNavigation<T extends string>(
  currentTab: T,
  defaultTab: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any,
) {
  // Redirect to default tab if no tab is specified
  useEffect(() => {
    if (!currentTab) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      void navigate({
        search: { tab: defaultTab },
        replace: true,
      })
    }
  }, [currentTab, navigate, defaultTab])

  const handleTabChange = useCallback(
    (newTab: T) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      void navigate({
        search: { tab: newTab },
        replace: true,
      })
    },
    [navigate],
  )

  return handleTabChange
}
