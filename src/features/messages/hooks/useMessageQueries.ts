import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { QUERY_DEFAULTS } from "@/services/query.constants"

import {
	getConversationMessages,
	getConversations,
	markConversationRead,
	sendConversationMessage,
	setConversationFavorite,
} from "../services/message.service"

import type { InfiniteData, QueryClient } from "@tanstack/react-query"
import type { ConversationMessage, ConversationSummary, CursorPaginatedResult } from "../types"

export const conversationsQueryKey = ["conversations"] as const
export const conversationMessagesQueryKey = (conversationId: string) =>
	["conversations", conversationId, "messages", "cursor"] as const

type ConversationMessagePages = InfiniteData<CursorPaginatedResult<ConversationMessage>, string | undefined>
type ConversationPages = InfiniteData<CursorPaginatedResult<ConversationSummary>, string | undefined>

const appendUniqueMessage = (
	current: ConversationMessagePages,
	message: ConversationMessage,
): ConversationMessagePages => {
	if (current.pages.some((page) => page.items.some((item) => item.id === message.id))) return current

	const [latestPage, ...olderPages] = current.pages
	if (!latestPage) {
		return {
			pages: [{ items: [message], limit: 50, hasMore: false }],
			pageParams: [undefined],
		}
	}

	return {
		...current,
		pages: [{ ...latestPage, items: [...latestPage.items, message] }, ...olderPages],
	}
}

export const applyMessageToCache = (
	queryClient: QueryClient,
	message: ConversationMessage,
	options: { selectedConversationId?: string; userId?: string },
) => {
	const cachedMessages = queryClient.getQueryData<ConversationMessagePages>(
		conversationMessagesQueryKey(message.conversationId),
	)
	if (cachedMessages?.pages.some((page) => page.items.some((item) => item.id === message.id))) return

	if (cachedMessages) {
		queryClient.setQueryData<ConversationMessagePages>(
			conversationMessagesQueryKey(message.conversationId),
			(current) => (current ? appendUniqueMessage(current, message) : current),
		)
	}
	queryClient.setQueryData<ConversationPages>(conversationsQueryKey, (current) => {
		if (!current) return current

		let found = false
		const items = current.pages
			.flatMap((page) => page.items)
			.map((conversation) => {
				if (conversation.id !== message.conversationId) return conversation
				found = true
				const isSelected = options.selectedConversationId === conversation.id
				const isOwnMessage = options.userId === message.senderId

				return {
					...conversation,
					lastMessage: {
						preview: Array.from(message.content).slice(0, 160).join(""),
						createdAt: message.createdAt,
						hasAttachment: Boolean(message.attachment),
					},
					updatedAt: message.createdAt,
					unreadCount: isSelected || isOwnMessage ? 0 : conversation.unreadCount + 1,
				}
			})
			.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))

		if (!found) return current

		let itemIndex = 0
		const pages = current.pages.map((page) => {
			const pageItems = items.slice(itemIndex, itemIndex + page.items.length)
			itemIndex += page.items.length
			return { ...page, items: pageItems }
		})
		return { ...current, pages }
	})
	void queryClient.invalidateQueries({ queryKey: conversationsQueryKey })
}

export const useConversationsQuery = () =>
	useInfiniteQuery({
		queryKey: conversationsQueryKey,
		queryFn: ({ pageParam }) => getConversations(pageParam),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		...QUERY_DEFAULTS,
	})

export const useConversationMessagesQuery = (conversationId?: string) =>
	useInfiniteQuery({
		queryKey: conversationMessagesQueryKey(conversationId ?? "none"),
		queryFn: ({ pageParam }) => getConversationMessages(conversationId ?? "", pageParam),
		enabled: Boolean(conversationId),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		...QUERY_DEFAULTS,
	})

export const useSendConversationMessage = (userId?: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
			sendConversationMessage(conversationId, content),
		onSuccess: (message) => {
			applyMessageToCache(queryClient, message, {
				selectedConversationId: message.conversationId,
				userId,
			})
		},
	})
}

export const useSetConversationFavorite = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ conversationId, isFavorite }: { conversationId: string; isFavorite: boolean }) =>
			setConversationFavorite(conversationId, isFavorite),
		onSuccess: (_data, { conversationId, isFavorite }) => {
			queryClient.setQueryData<ConversationPages>(conversationsQueryKey, (current) =>
				current
					? {
							...current,
							pages: current.pages.map((page) => ({
								...page,
								items: page.items.map((conversation) =>
									conversation.id === conversationId ? { ...conversation, isFavorite } : conversation,
								),
							})),
						}
					: current,
			)
		},
	})
}

export const useMarkConversationRead = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: markConversationRead,
		onSuccess: (_data, conversationId) => {
			queryClient.setQueryData<ConversationPages>(conversationsQueryKey, (current) =>
				current
					? {
							...current,
							pages: current.pages.map((page) => ({
								...page,
								items: page.items.map((conversation) =>
									conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
								),
							})),
						}
					: current,
			)
		},
	})
}
