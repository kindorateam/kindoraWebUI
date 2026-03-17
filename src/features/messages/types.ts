export type MessageTab = "all" | "favorites"

export type FavoriteState = "pinned" | "highlighted" | "idle"

export interface BubbleItem {
	id: string
	align: "left" | "right"
	text: string
	time: string
}

export interface ThreadItem {
	id: string
	name: string
	preview: string
	time: string
	dateLabel: string
	favorite: FavoriteState
	unreadCount?: number
	parents: string[]
	messages: BubbleItem[]
}
