import { useEffect, useState } from "react"

import { messageThreadItems } from "../constants"

import type { MessageTab, ThreadItem } from "../types"

export const useMessages = () => {
	const [activeTab, setActiveTab] = useState<MessageTab>("all")
	const [searchValue, setSearchValue] = useState("")
	const [selectedThreadId, setSelectedThreadId] = useState("thread-4")
	const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false)
	const [threads, setThreads] = useState<ThreadItem[]>(messageThreadItems)

	const normalizedQuery = searchValue.trim().toLowerCase()
	const filteredByTab = activeTab === "favorites" ? threads.filter((item) => item.favorite !== "idle") : threads
	const visibleThreads = !normalizedQuery
		? filteredByTab
		: filteredByTab.filter((item) => item.name.toLowerCase().includes(normalizedQuery))

	const selectedThread =
		activeTab === "favorites"
			? (visibleThreads.find((item) => item.id === selectedThreadId) ?? null)
			: (threads.find((item) => item.id === selectedThreadId) ?? null)

	useEffect(() => {
		if (activeTab !== "favorites") {
			return
		}

		const isSelectedThreadStillFavorite = filteredByTab.some((item) => item.id === selectedThreadId)

		if (!isSelectedThreadStillFavorite) {
			setSelectedThreadId("")
			setIsMobileConversationOpen(false)
		}
	}, [activeTab, filteredByTab, selectedThreadId])

	const handleThreadSelect = (threadId: string) => {
		setSelectedThreadId(threadId)
		setIsMobileConversationOpen(true)
	}
	const handleBackToList = () => {
		setIsMobileConversationOpen(false)
	}
	const handleToggleFavorite = (threadId: string) => {
		setThreads((currentThreads) =>
			currentThreads.map((thread) =>
				thread.id === threadId
					? {
							...thread,
							favorite: thread.favorite === "idle" ? "highlighted" : "idle",
						}
					: thread,
			),
		)
	}

	return {
		activeTab,
		handleBackToList,
		handleThreadSelect,
		handleToggleFavorite,
		isMobileConversationOpen,
		searchValue,
		selectedThread,
		selectedThreadId,
		setActiveTab,
		setSearchValue,
		visibleThreads,
	}
}
