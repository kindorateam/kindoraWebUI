import { useCallback, useEffect } from "react"

import type { NavigateFn } from "@tanstack/react-router"

/**
 * Custom hook for handling tab navigation in detail pages.
 * Manages redirect to default tab if no tab is specified and provides a handler for tab changes.
 * @param currentTab - The current active tab
 * @param defaultTab - The default tab to redirect to if no tab is specified
 * @param navigate - The navigate function from TanStack Router
 * @returns handleTabChange - Function to change the tab
 */
export function useTabNavigation<T extends string>(currentTab: T | undefined, defaultTab: T, navigate: NavigateFn) {
	const handleTabChange = useCallback(
		(newTab: T) => {
			void navigate({
				search: (prev: Record<string, unknown>) => ({ ...prev, tab: newTab }) as never,
				replace: true,
			})
		},
		[navigate],
	)

	// Redirect to default tab if none specified
	useEffect(() => {
		if (!currentTab) {
			handleTabChange(defaultTab)
		}
	}, [currentTab, defaultTab, handleTabChange])

	return handleTabChange
}
