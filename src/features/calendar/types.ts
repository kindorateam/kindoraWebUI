export interface CalendarEvent {
	id: string
	title: string
	description?: string
	start: string
	end: string
	allDay: boolean
	color?: string
}

export interface ApiCalendarEvent {
	id: string
	title: string
	description?: string
	startDate: string
	endDate: string
	allDay: boolean
	color?: string
}

export interface CreateEventPayload {
	title: string
	description?: string
	startDate: string
	endDate: string
	allDay: boolean
	color?: string
}

export interface UpdateEventPayload {
	title?: string
	description?: string
	startDate?: string
	endDate?: string
	allDay?: boolean
	color?: string
}

export interface EventFormData {
	title: string
	description: string
	startDate: string
	startTime: string
	endDate: string
	endTime: string
	allDay: boolean
	color: string
}

export interface GetEventsParams {
	start: string
	end: string
}

export type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "multiMonthYear"
