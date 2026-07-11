import { toast } from "@heroui/react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import useAuth from "@/features/auth/hooks/useAuth"
import { getErrorMessage } from "@/utils/error"

import { toThread } from "../utils/messageView"

import {
	useConversationMessagesQuery,
	useConversationsQuery,
	useMarkConversationRead,
	useSendConversationMessage,
	useSetConversationFavorite,
} from "./useMessageQueries"
import { useMessageSocket } from "./useMessageSocket"

import type { MessageTab } from "../types"

export const useMessages = () => {
	const { i18n, t } = useTranslation()
	const { user } = useAuth()
	const conversationsQuery = useConversationsQuery()
	const [activeTab, setActiveTab] = useState<MessageTab>("all")
	const [searchValue, setSearchValue] = useState("")
	const [selectedThreadId, setSelectedThreadId] = useState<string>()
	const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false)
	const messagesQuery = useConversationMessagesQuery(selectedThreadId)
	const sendMessageMutation = useSendConversationMessage(user?.id)
	const favoriteMutation = useSetConversationFavorite()
	const markReadMutation = useMarkConversationRead()
	const { connection, reconnect } = useMessageSocket({ selectedConversationId: selectedThreadId, userId: user?.id })
	const conversations = conversationsQuery.data?.pages.flatMap((page) => page.items) ?? []
	const messages = messagesQuery.data ? [...messagesQuery.data.pages].reverse().flatMap((page) => page.items) : []
	const selectedConversation = conversations.find((conversation) => conversation.id === selectedThreadId)
	const threadOptions = {
		attachmentLabel: t("messages.thread.attachment"),
		dateFormatter: new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "short" }),
		noMessagesLabel: t("messages.thread.noMessages"),
		timeFormatter: new Intl.DateTimeFormat(i18n.language, { hour: "numeric", minute: "2-digit" }),
		untitledLabel: t("messages.thread.untitled"),
		userId: user?.id,
	}

	useEffect(() => {
		if (conversations.length === 0) {
			setSelectedThreadId(undefined)
			return
		}
		if (!selectedThreadId || !conversations.some((conversation) => conversation.id === selectedThreadId)) {
			setSelectedThreadId(conversations[0]?.id)
		}
	}, [conversations, selectedThreadId])

	const threads = conversations.map((conversation) => toThread(conversation, [], threadOptions))
	const normalizedQuery = searchValue.trim().toLowerCase()
	const filteredByTab = activeTab === "favorites" ? threads.filter((item) => item.favorite === "favorite") : threads
	const visibleThreads = !normalizedQuery
		? filteredByTab
		: filteredByTab.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
	const selectedThread =
		selectedConversation && (activeTab !== "favorites" || selectedConversation.isFavorite)
			? toThread(selectedConversation, messages, threadOptions)
			: null

	const handleThreadSelect = (threadId: string) => {
		setSelectedThreadId(threadId)
		setIsMobileConversationOpen(true)
		markReadMutation.mutate(threadId)
	}
	const handleToggleFavorite = (threadId: string) => {
		const conversation = conversations.find((item) => item.id === threadId)
		if (!conversation) return

		favoriteMutation.mutate(
			{ conversationId: threadId, isFavorite: !conversation.isFavorite },
			{
				onError: (error) => {
					toast(t("messages.toast.favoriteFailed"), { description: getErrorMessage(error), variant: "danger" })
				},
			},
		)
	}
	const handleSendMessage = async (content: string) => {
		if (!selectedThreadId) return

		try {
			await sendMessageMutation.mutateAsync({ conversationId: selectedThreadId, content })
		} catch (error) {
			toast(t("messages.toast.sendFailed"), { description: getErrorMessage(error), variant: "danger" })
			throw error
		}
	}
	const handleLoadOlderMessages = async () => {
		await messagesQuery.fetchNextPage()
	}
	const handleLoadMoreConversations = async () => {
		await conversationsQuery.fetchNextPage()
	}

	return {
		activeTab,
		connection,
		handleReconnect: reconnect,
		handleBackToList: () => setIsMobileConversationOpen(false),
		handleSendMessage,
		handleThreadSelect,
		handleToggleFavorite,
		hasThreads: conversations.length > 0,
		hasOlderMessages: Boolean(messagesQuery.hasNextPage),
		hasMoreConversations: Boolean(conversationsQuery.hasNextPage),
		handleLoadMoreConversations,
		handleLoadOlderMessages,
		isLoadingMessages: messagesQuery.isLoading,
		isLoadingThreads: conversationsQuery.isLoading,
		isLoadingMoreConversations: conversationsQuery.isFetchingNextPage,
		isMoreConversationsError: conversationsQuery.isFetchNextPageError,
		isMessagesError: messagesQuery.isError,
		isOlderMessagesError: messagesQuery.isFetchNextPageError,
		isLoadingOlderMessages: messagesQuery.isFetchingNextPage,
		isSendingMessage: sendMessageMutation.isPending,
		isThreadsError: conversationsQuery.isError,
		isMobileConversationOpen,
		refetchMessages: messagesQuery.refetch,
		refetchThreads: conversationsQuery.refetch,
		searchValue,
		selectedThread,
		selectedThreadId,
		setActiveTab,
		setSearchValue,
		visibleThreads,
	}
}
