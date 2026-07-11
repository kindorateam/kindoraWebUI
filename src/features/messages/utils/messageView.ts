import { getMediaUrl } from "@/utils/media"

import type { BubbleItem, ConversationMessage, ConversationSummary, ThreadItem } from "../types"

interface ThreadViewOptions {
	dateFormatter: Intl.DateTimeFormat
	attachmentLabel: string
	noMessagesLabel: string
	timeFormatter: Intl.DateTimeFormat
	untitledLabel: string
	userId?: string
}

const getConversationName = (conversation: ConversationSummary, fallback: string): string => {
	if (conversation.student) return `${conversation.student.firstName} ${conversation.student.lastName}`
	return conversation.room?.name ?? fallback
}

const toBubble = (
	message: ConversationMessage,
	userId: string | undefined,
	timeFormatter: Intl.DateTimeFormat,
): BubbleItem => ({
	id: message.id,
	align: message.senderId === userId ? "right" : "left",
	text: message.content,
	time: timeFormatter.format(new Date(message.createdAt)),
})

export const toThread = (
	conversation: ConversationSummary,
	messages: ConversationMessage[],
	options: ThreadViewOptions,
): ThreadItem => {
	const activityDate = new Date(conversation.lastMessage?.createdAt ?? conversation.updatedAt)

	return {
		id: conversation.id,
		name: getConversationName(conversation, options.untitledLabel),
		avatarUrl: conversation.student?.avatarPath ? getMediaUrl(conversation.student.avatarPath) : undefined,
		preview:
			conversation.lastMessage?.preview ||
			(conversation.lastMessage?.hasAttachment ? options.attachmentLabel : options.noMessagesLabel),
		time: options.timeFormatter.format(activityDate),
		dateLabel: options.dateFormatter.format(activityDate),
		favorite: conversation.isFavorite ? "favorite" : "idle",
		unreadCount: conversation.unreadCount || undefined,
		parents: conversation.parents.map((parent, index) => ({
			id: `${conversation.id}-parent-${index}`,
			name: `${parent.firstName} ${parent.lastName}`,
			email: parent.email,
			phone: parent.phone,
		})),
		messages: messages.map((message) => toBubble(message, options.userId, options.timeFormatter)),
	}
}
