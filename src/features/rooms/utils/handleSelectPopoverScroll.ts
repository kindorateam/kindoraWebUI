import type React from "react"
import type { RefObject } from "react"

const SCROLL_THRESHOLD = 50

export const handleSelectPopoverScroll = (
	e: React.UIEvent<HTMLDivElement>,
	hasNext: boolean,
	isFetching: boolean,
	requestLockRef: RefObject<boolean>,
	fetchNext: () => Promise<unknown> | undefined,
) => {
	if (!hasNext || isFetching || requestLockRef.current) return

	const target = e.currentTarget

	// Ignore initial synthetic scroll events before the user moves the list.
	if (target.scrollTop === 0) return

	const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < SCROLL_THRESHOLD

	if (!nearBottom) return

	requestLockRef.current = true

	Promise.resolve(fetchNext()).finally(() => {
		requestLockRef.current = false
	})
}
