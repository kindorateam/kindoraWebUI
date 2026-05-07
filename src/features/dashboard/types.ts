import type React from "react"

export interface Person {
	name: string
	seed: string
}

export interface SignedInMetric {
	labelKey: string
	total: number
	value: number
}

export interface SummaryMetric {
	icon: React.ComponentType<{ className?: string }>
	labelKey: string
	value: number
}

export interface RoomStatus {
	id: string
	ratio: string
	ratioTone: "danger" | "success" | "warning"
	room: string
	staff: Person[]
	staffSignedIn: string
	students: Person[]
	studentsSignedIn: string
}

export interface UpcomingEvent {
	date: string
	day: string
	label: string
	time: string
}

export interface AttentionItem extends Person {
	description: string
}

export interface FinanceCard {
	accentClassName: string
	actionLabelKey: string
	labelKey: string
	supportingTextKey: string
	value: string
}

export interface ActivityEntry {
	count: number
	icon: React.ComponentType<{ className?: string }>
	label: string
	progress: number
}

export interface ActivityRoom {
	count: number
	entries?: ActivityEntry[]
	id: string
	name: string
}
