import { useState } from "react"

import { messageThreadItems } from "../constants"

import type { MessageConnectionState, MessageTab, ThreadItem } from "../types"

export const useMessages = () => {
	const [activeTab, setActiveTab] = useState<MessageTab>("all")
	const [searchValue, setSearchValue] = useState("")
	const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(messageThreadItems[3]?.id)
	const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false)
	const [threads, setThreads] = useState<ThreadItem[]>(messageThreadItems)
	const [connection, setConnection] = useState<MessageConnectionState>({
		status: "connected",
	})

	const normalizedQuery = searchValue.trim().toLowerCase()
	const filteredByTab = activeTab === "favorites" ? threads.filter((item) => item.favorite !== "idle") : threads
	const visibleThreads = !normalizedQuery
		? filteredByTab
		: filteredByTab.filter((item) => item.name.toLowerCase().includes(normalizedQuery))

	const selectedThread =
		activeTab === "favorites"
			? (visibleThreads.find((item) => item.id === selectedThreadId) ?? null)
			: (threads.find((item) => item.id === selectedThreadId) ?? null)

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
							favorite: thread.favorite === "idle" ? "favorite" : "idle",
						}
					: thread,
			),
		)
	}
	const handleReconnect = () => {
		setConnection({ status: "connected" })
	}

	return {
		activeTab,
		connection,
		handleReconnect,
		handleBackToList,
		handleThreadSelect,
		handleToggleFavorite,
		hasThreads: threads.length > 0,
		isMobileConversationOpen,
		searchValue,
		selectedThread,
		selectedThreadId,
		setActiveTab,
		setSearchValue,
		visibleThreads,
	}
}
