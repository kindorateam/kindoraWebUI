import { getMediaUrl } from "@/utils/media"

import type { BubbleItem, ConversationMessage, ConversationSummary, ThreadItem } from "../types"

interface ThreadViewOptions {
	dateFormatter: Intl.DateTimeFormat
	attachmentLabel: string
	messageDateFormatter: Intl.DateTimeFormat
	noMessagesLabel: string
	timeFormatter: Intl.DateTimeFormat
	todayLabel: string
	untitledLabel: string
	userId?: string
	yesterdayLabel: string
}

const getDateKey = (date: Date): string =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

const getRelativeDateLabel = (
	date: Date,
	options: Pick<ThreadViewOptions, "messageDateFormatter" | "todayLabel" | "yesterdayLabel">,
): string => {
	const today = new Date()
	if (getDateKey(date) === getDateKey(today)) return options.todayLabel

	const yesterday = new Date(today)
	yesterday.setDate(today.getDate() - 1)
	if (getDateKey(date) === getDateKey(yesterday)) return options.yesterdayLabel

	return options.messageDateFormatter.format(date)
}

const getConversationName = (conversation: ConversationSummary, fallback: string): string => {
	if (conversation.student) return `${conversation.student.firstName} ${conversation.student.lastName}`
	return conversation.room?.name ?? fallback
}

const toBubble = (message: ConversationMessage, options: ThreadViewOptions): BubbleItem => {
	const createdAt = new Date(message.createdAt)

	return {
		id: message.id,
		align: message.senderId === options.userId ? "right" : "left",
		dateKey: getDateKey(createdAt),
		dateLabel: getRelativeDateLabel(createdAt, options),
		senderId: message.senderId,
		senderName: message.senderName,
		text: message.content,
		time: options.timeFormatter.format(createdAt),
	}
}

export const toThread = (
	conversation: ConversationSummary,
	messages: ConversationMessage[],
	options: ThreadViewOptions,
): ThreadItem => {
	const activityDate = new Date(conversation.lastMessage?.createdAt ?? conversation.updatedAt)
	const relativeActivityLabel = getRelativeDateLabel(activityDate, options)

	return {
		id: conversation.id,
		name: getConversationName(conversation, options.untitledLabel),
		avatarUrl: conversation.student?.avatarPath ? getMediaUrl(conversation.student.avatarPath) : undefined,
		preview:
			conversation.lastMessage?.preview ||
			(conversation.lastMessage?.hasAttachment ? options.attachmentLabel : options.noMessagesLabel),
		activityLabel:
			relativeActivityLabel === options.todayLabel
				? options.timeFormatter.format(activityDate)
				: relativeActivityLabel === options.yesterdayLabel
					? relativeActivityLabel
					: options.dateFormatter.format(activityDate),
		favorite: conversation.isFavorite ? "favorite" : "idle",
		unreadCount: conversation.unreadCount || undefined,
		parents: conversation.parents.map((parent, index) => ({
			id: `${conversation.id}-parent-${index}`,
			name: `${parent.firstName} ${parent.lastName}`,
			email: parent.email,
			phone: parent.phone,
		})),
		messages: messages.map((message) => toBubble(message, options)),
	}
}
