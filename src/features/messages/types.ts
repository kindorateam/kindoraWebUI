export type MessageTab = "all" | "favorites"

export type FavoriteState = "favorite" | "idle"

export type MessageConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected" | "error"

export interface MessageConnectionState {
	status: MessageConnectionStatus
	errorMessage?: string
}

export interface MessageMedia {
	id: string
	path: string
	name?: string
}

export interface ConversationMessage {
	id: string
	conversationId: string
	senderId: string
	senderName: string
	content: string
	attachment?: MessageMedia
	createdAt: string
}

export interface ConversationParticipant {
	firstName: string
	lastName: string
	email: string
	phone?: string
}

export interface ConversationStudent {
	firstName: string
	lastName: string
	avatarPath?: string
}

export interface ConversationSummary {
	id: string
	room?: { name: string }
	parents: ConversationParticipant[]
	student?: ConversationStudent
	lastMessage?: {
		preview: string
		createdAt: string
		hasAttachment: boolean
	}
	isFavorite: boolean
	unreadCount: number
	updatedAt: string
}

export interface CursorPaginatedResult<T> {
	items: T[]
	limit: number
	hasMore: boolean
	nextCursor?: string
}

export interface MessageSocketTicket {
	ticket: string
	expiresAt: string
}

export interface NewMessageFrame {
	type: "new_message"
	conversationId: string
	message: ConversationMessage
}

export interface BubbleItem {
	id: string
	align: "left" | "right"
	dateKey: string
	dateLabel: string
	senderId: string
	senderName: string
	text: string
	time: string
}

export interface ThreadItem {
	id: string
	name: string
	avatarUrl?: string
	preview: string
	activityLabel: string
	favorite: FavoriteState
	unreadCount?: number
	parents: ThreadParent[]
	messages: BubbleItem[]
}

export interface ThreadParent {
	id: string
	name: string
	email: string
	phone?: string
}
