import { apiClient } from "@/services/api.service"

import type {
	ConversationMessage,
	ConversationSummary,
	CursorPaginatedResult,
	MessageSocketTicket,
	NewMessageFrame,
} from "../types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1"
const CONVERSATION_PAGE_SIZE = 30
const MESSAGE_PAGE_SIZE = 50

export const getConversations = (before?: string): Promise<CursorPaginatedResult<ConversationSummary>> =>
	apiClient.get<CursorPaginatedResult<ConversationSummary>>("/conversations", {
		params: { limit: CONVERSATION_PAGE_SIZE, before },
	})

export const getConversationMessages = (
	conversationId: string,
	before?: string,
): Promise<CursorPaginatedResult<ConversationMessage>> =>
	apiClient.get<CursorPaginatedResult<ConversationMessage>>(`/conversations/${conversationId}/messages`, {
		params: { limit: MESSAGE_PAGE_SIZE, before },
	})

export const sendConversationMessage = (conversationId: string, content: string): Promise<ConversationMessage> =>
	apiClient.post<ConversationMessage>(`/conversations/${conversationId}/messages`, { content })

export const setConversationFavorite = async (conversationId: string, isFavorite: boolean): Promise<void> => {
	if (isFavorite) {
		await apiClient.post(`/conversations/${conversationId}/favorite`)
		return
	}

	await apiClient.delete(`/conversations/${conversationId}/favorite`)
}

export const markConversationRead = (conversationId: string): Promise<void> =>
	apiClient.post(`/conversations/${conversationId}/read`)

export const createMessageSocketTicket = (): Promise<MessageSocketTicket> =>
	apiClient.post<MessageSocketTicket>("/ws/ticket")

const getMessageSocketUrl = (ticket: string): string => {
	const url = new URL(API_BASE_URL, window.location.origin)
	url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
	url.pathname = `${url.pathname.replace(/\/$/, "")}/ws`
	url.search = new URLSearchParams({ ticket }).toString()
	return url.toString()
}

export const openMessageSocket = (ticket: string): WebSocket => new WebSocket(getMessageSocketUrl(ticket))

export const parseMessageSocketFrame = (data: unknown): NewMessageFrame | null => {
	if (typeof data !== "string") return null

	try {
		const frame: unknown = JSON.parse(data)
		if (typeof frame !== "object" || frame === null) return null

		const candidate = frame as Partial<NewMessageFrame>
		if (candidate.type !== "new_message" || typeof candidate.conversationId !== "string") return null
		if (typeof candidate.message !== "object" || candidate.message === null) return null
		if (
			typeof candidate.message.id !== "string" ||
			typeof candidate.message.conversationId !== "string" ||
			typeof candidate.message.senderId !== "string" ||
			typeof candidate.message.content !== "string" ||
			typeof candidate.message.createdAt !== "string"
		) {
			return null
		}

		return candidate as NewMessageFrame
	} catch {
		return null
	}
}
