import { useLayoutEffect, useRef } from "react"

const LOAD_OLDER_THRESHOLD_PX = 80
const STICK_TO_BOTTOM_THRESHOLD_PX = 160

interface UseConversationScrollOptions {
	hasOlderMessages: boolean
	isLoadingOlderMessages: boolean
	messageCount: number
	onLoadOlderMessages: () => Promise<void>
}

export const useConversationScroll = ({
	hasOlderMessages,
	isLoadingOlderMessages,
	messageCount,
	onLoadOlderMessages,
}: UseConversationScrollOptions) => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const didInitialScrollRef = useRef(false)
	const isRequestingOlderRef = useRef(false)
	const previousMessageCountRef = useRef(0)

	useLayoutEffect(() => {
		const scrollElement = scrollRef.current
		if (!scrollElement || messageCount === 0) return

		if (!didInitialScrollRef.current) {
			scrollElement.scrollTop = scrollElement.scrollHeight
			didInitialScrollRef.current = true
		} else if (messageCount > previousMessageCountRef.current && !isRequestingOlderRef.current) {
			const distanceFromBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight
			if (distanceFromBottom <= STICK_TO_BOTTOM_THRESHOLD_PX) {
				scrollElement.scrollTop = scrollElement.scrollHeight
			}
		}

		previousMessageCountRef.current = messageCount
	}, [messageCount])

	const loadOlderMessages = async () => {
		const scrollElement = scrollRef.current
		if (!scrollElement || !hasOlderMessages || isLoadingOlderMessages || isRequestingOlderRef.current) return

		isRequestingOlderRef.current = true
		const previousScrollHeight = scrollElement.scrollHeight

		try {
			await onLoadOlderMessages()
			requestAnimationFrame(() => {
				const currentScrollElement = scrollRef.current
				if (!currentScrollElement) return

				currentScrollElement.scrollTop += currentScrollElement.scrollHeight - previousScrollHeight
			})
		} finally {
			requestAnimationFrame(() => {
				isRequestingOlderRef.current = false
			})
		}
	}

	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		if (event.currentTarget.scrollTop <= LOAD_OLDER_THRESHOLD_PX) void loadOlderMessages()
	}

	return { handleScroll, loadOlderMessages, scrollRef }
}
