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
	type NavigateOptions = Parameters<typeof navigate>[0]
	type SearchState = NavigateOptions extends { search?: infer TSearch }
		? TSearch extends (prev: infer P) => unknown
			? P
			: Record<string, unknown>
		: Record<string, unknown>

	const handleTabChange = useCallback(
		(newTab: T) => {
			const searchUpdater = ((prev: SearchState) => ({
				...prev,
				tab: newTab,
			})) as NavigateOptions["search"]

			const options = {
				replace: true,
				search: searchUpdater,
			} as NavigateOptions

			void navigate(options)
		},
		[navigate],
	)

	useEffect(() => {
		if (!currentTab) {
			handleTabChange(defaultTab)
		}
	}, [currentTab, defaultTab, handleTabChange])

	return handleTabChange
}
