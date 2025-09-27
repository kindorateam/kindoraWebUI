import { useCallback } from "react"

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
	const handleTabChange = useCallback(
		(newTab: T) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			void navigate({
				replace: true,
				// Preserve any existing search params
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
