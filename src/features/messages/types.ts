export type MessageTab = "all" | "favorites"

export type FavoriteState = "favorite" | "idle"

export type MessageConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected" | "error"

export interface MessageConnectionState {
	status: MessageConnectionStatus
	errorMessage?: string
}

export interface BubbleItem {
	id: string
	align: "left" | "right"
	text: string
	time: string
}

export interface ThreadItem {
	id: string
	name: string
	avatarUrl?: string
	preview: string
	time: string
	dateLabel: string
	favorite: FavoriteState
	unreadCount?: number
	parents: string[]
	messages: BubbleItem[]
}
