import { useMemo, useState } from "react"

import { messageThreadItems } from "../constants"

import type { MessageTab } from "../types"

export const useMessages = () => {
	const [activeTab, setActiveTab] = useState<MessageTab>("all")
	const [searchValue, setSearchValue] = useState("")
	const [selectedThreadId, setSelectedThreadId] = useState("thread-4")

	const visibleThreads = useMemo(() => {
		const normalizedQuery = searchValue.trim().toLowerCase()
		const filteredByTab =
			activeTab === "favorites" ? messageThreadItems.filter((item) => item.favorite !== "idle") : messageThreadItems

		if (!normalizedQuery) {
			return filteredByTab
		}

		return filteredByTab.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
	}, [activeTab, searchValue])

	const selectedThread = useMemo(() => {
		const selectedFromVisible = visibleThreads.find((item) => item.id === selectedThreadId)
		return selectedFromVisible ?? visibleThreads[0] ?? null
	}, [selectedThreadId, visibleThreads])

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
