import { useState } from "react"

import { messageThreadItems } from "../constants"

import type { MessageTab } from "../types"

export const useMessages = () => {
	const [activeTab, setActiveTab] = useState<MessageTab>("all")
	const [searchValue, setSearchValue] = useState("")
	const [selectedThreadId, setSelectedThreadId] = useState("thread-4")

	const normalizedQuery = searchValue.trim().toLowerCase()
	const filteredByTab =
		activeTab === "favorites" ? messageThreadItems.filter((item) => item.favorite !== "idle") : messageThreadItems
	const visibleThreads = !normalizedQuery
		? filteredByTab
		: filteredByTab.filter((item) => item.name.toLowerCase().includes(normalizedQuery))

	const selectedFromVisible = visibleThreads.find((item) => item.id === selectedThreadId)
	const selectedThread = selectedFromVisible ?? visibleThreads[0] ?? null

	return {
		activeTab,
		searchValue,
		selectedThread,
		selectedThreadId,
		setActiveTab,
		setSearchValue,
		setSelectedThreadId,
		visibleThreads,
	}
}
