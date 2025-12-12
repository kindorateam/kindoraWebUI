export interface Newsletter {
	id: string
	title: string
	sentDate: string
	status: "draft" | "scheduled" | "sent"
}
