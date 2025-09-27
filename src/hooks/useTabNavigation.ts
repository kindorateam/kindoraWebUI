import { useCallback } from "react"

import type { NavigateFn } from "@tanstack/react-router"

/**
 * Custom hook for handling tab navigation in detail pages.
 * Manages redirect to default tab if no tab is specified and provides a handler for tab changes.
 * @param currentTab - The current active tab
 * @param defaultTab - The default tab to redirect to if no tab is specified
 * @param navigate - The navigate function from TanStack Router
 * @returns handleTabChange - Function to change the tab
 */
export function useTabNavigation<T extends string>(_currentTab: T, _defaultTab: T, navigate: NavigateFn) {
	const handleTabChange = useCallback(
		(newTab: T) => {
			void navigate({
				replace: true,
				//@ts-expect-error
				search: (prev: Record<string, unknown>) => ({
					...prev,
					tab: newTab,
				}),
			})
		},
		[navigate],
	)

	return handleTabChange
}
