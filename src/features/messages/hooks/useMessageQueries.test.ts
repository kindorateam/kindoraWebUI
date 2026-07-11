import { QueryClient } from "@tanstack/react-query"

import { applyMessageToCache, conversationMessagesQueryKey, conversationsQueryKey } from "./useMessageQueries"

import type { InfiniteData } from "@tanstack/react-query"
import type { ConversationMessage, ConversationSummary, CursorPaginatedResult } from "../types"

import { describe, expect, test } from "bun:test"

const conversation: ConversationSummary = {
	id: "conversation-1",
	parents: [],
	isFavorite: false,
	unreadCount: 0,
	updatedAt: "2026-07-10T12:00:00.000Z",
}

const message: ConversationMessage = {
	id: "message-1",
	conversationId: conversation.id,
	senderId: "employee-2",
	senderName: "Taylor Smith",
	content: "Hello",
	createdAt: "2026-07-10T13:00:00.000Z",
}

const seedConversations = (queryClient: QueryClient) => {
	queryClient.setQueryData<InfiniteData<CursorPaginatedResult<ConversationSummary>, string | undefined>>(
		conversationsQueryKey,
		{
			pages: [{ items: [conversation], limit: 30, hasMore: false }],
			pageParams: [undefined],
		},
	)
}

describe("message query cache", () => {
	test("adds a live message once and increments unread count", () => {
		const queryClient = new QueryClient()
		seedConversations(queryClient)
		queryClient.setQueryData<InfiniteData<CursorPaginatedResult<ConversationMessage>, string | undefined>>(
			conversationMessagesQueryKey(conversation.id),
			{
				pages: [{ items: [], limit: 50, hasMore: false }],
				pageParams: [undefined],
			},
		)

		applyMessageToCache(queryClient, message, { userId: "employee-1" })
		applyMessageToCache(queryClient, message, { userId: "employee-1" })

		const messages = queryClient.getQueryData<
			InfiniteData<CursorPaginatedResult<ConversationMessage>, string | undefined>
		>(conversationMessagesQueryKey(conversation.id))
		const conversations =
			queryClient.getQueryData<InfiniteData<CursorPaginatedResult<ConversationSummary>, string | undefined>>(
				conversationsQueryKey,
			)

		expect(messages?.pages[0]?.items).toHaveLength(1)
		expect(conversations?.pages[0]?.items[0]?.lastMessage?.preview).toBe(message.content)
		expect(conversations?.pages[0]?.items[0]?.unreadCount).toBe(1)
	})

	test("keeps the selected conversation read", () => {
		const queryClient = new QueryClient()
		seedConversations(queryClient)

		applyMessageToCache(queryClient, message, {
			selectedConversationId: conversation.id,
			userId: "employee-1",
		})

		const conversations =
			queryClient.getQueryData<InfiniteData<CursorPaginatedResult<ConversationSummary>, string | undefined>>(
				conversationsQueryKey,
			)
		expect(conversations?.pages[0]?.items[0]?.unreadCount).toBe(0)
	})
})
