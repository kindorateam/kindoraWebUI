import { DEFAULT_EVENT_COLOR } from "../constants"

import type { CalendarEvent, CreateEventPayload, GetEventsParams, UpdateEventPayload } from "../types"

const toLocalDateString = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const toLocalDateTimeString = (date: Date): string => {
	return `${toLocalDateString(date)}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`
}

const addDays = (date: Date, days: number): Date => {
	const nextDate = new Date(date)
	nextDate.setDate(nextDate.getDate() + days)
	return nextDate
}

const setTime = (date: Date, hours: number, minutes = 0): Date => {
	const nextDate = new Date(date)
	nextDate.setHours(hours, minutes, 0, 0)
	return nextDate
}

const parseDateValue = (value: string): Date => {
	if (value.length === 10) {
		return new Date(`${value}T00:00:00`)
	}

	return new Date(value)
}

const createTimedEvent = (
	id: string,
	title: string,
	start: Date,
	end: Date,
	description?: string,
	color?: string,
): CalendarEvent => ({
	id,
	title,
	description,
	start: toLocalDateTimeString(start),
	end: toLocalDateTimeString(end),
	allDay: false,
	color: color ?? DEFAULT_EVENT_COLOR,
})

const createAllDayEvent = (
	id: string,
	title: string,
	start: Date,
	durationInDays: number,
	description?: string,
	color?: string,
): CalendarEvent => ({
	id,
	title,
	description,
	start: toLocalDateString(start),
	end: toLocalDateString(addDays(start, durationInDays)),
	allDay: true,
	color: color ?? DEFAULT_EVENT_COLOR,
})

const createMockEvents = (): CalendarEvent[] => {
	const now = new Date()
	const today = setTime(now, 0, 0)

	return [
		createTimedEvent(
			"calendar-1",
			"Parent-teacher conferences",
			setTime(addDays(today, -1), 15, 0),
			setTime(addDays(today, -1), 17, 30),
			"Conference slots for the toddler group.",
			"#17C964",
		),
		createTimedEvent(
			"calendar-2",
			"Morning staff briefing",
			setTime(today, 8, 30),
			setTime(today, 9, 0),
			"Weekly planning and classroom updates.",
			"#006FEE",
		),
		createTimedEvent(
			"calendar-3",
			"STEM workshop",
			setTime(addDays(today, 1), 10, 0),
			setTime(addDays(today, 1), 11, 30),
			"Hands-on activity for pre-K students.",
			"#7828C8",
		),
		createTimedEvent(
			"calendar-4",
			"Pickup policy review",
			setTime(addDays(today, 3), 16, 0),
			setTime(addDays(today, 3), 16, 45),
			"Internal check-in with front-desk staff.",
			"#F5A524",
		),
		createAllDayEvent("calendar-5", "Spring break", addDays(today, 7), 5, "Center closed for spring break.", "#F31260"),
		createAllDayEvent(
			"calendar-6",
			"Enrollment open house",
			addDays(today, 14),
			1,
			"Families can visit classrooms throughout the day.",
			"#71717A",
		),
	]
}

const sortEvents = (events: CalendarEvent[]): CalendarEvent[] => {
	return [...events].sort((left, right) => parseDateValue(left.start).getTime() - parseDateValue(right.start).getTime())
}

const overlapsRange = (event: CalendarEvent, range: GetEventsParams): boolean => {
	const eventStart = parseDateValue(event.start)
	const eventEnd = parseDateValue(event.end)
	const rangeStart = parseDateValue(range.start)
	const rangeEnd = parseDateValue(range.end)

	return eventStart < rangeEnd && eventEnd > rangeStart
}

const generateEventId = (): string => {
	return globalThis.crypto?.randomUUID?.() ?? `calendar-${Date.now()}`
}

let mockCalendarEvents: CalendarEvent[] = createMockEvents()

export const getEvents = async (params: GetEventsParams): Promise<CalendarEvent[]> => {
	return sortEvents(mockCalendarEvents.filter((event) => overlapsRange(event, params)))
}

export const createEvent = async (payload: CreateEventPayload): Promise<CalendarEvent> => {
	const event: CalendarEvent = {
		id: generateEventId(),
		title: payload.title,
		description: payload.description,
		start: payload.startDate,
		end: payload.endDate,
		allDay: payload.allDay,
		color: payload.color ?? DEFAULT_EVENT_COLOR,
	}

	mockCalendarEvents = sortEvents([...mockCalendarEvents, event])

	return event
}

export const updateEvent = async (eventId: string, payload: UpdateEventPayload): Promise<CalendarEvent> => {
	const eventIndex = mockCalendarEvents.findIndex((event) => event.id === eventId)

	if (eventIndex === -1) {
		throw new Error("Event not found")
	}

	const existingEvent = mockCalendarEvents[eventIndex]

	if (!existingEvent) {
		throw new Error("Event not found")
	}

	const updatedEvent: CalendarEvent = {
		...existingEvent,
		...(payload.title !== undefined ? { title: payload.title } : {}),
		...(payload.description !== undefined ? { description: payload.description } : {}),
		...(payload.startDate !== undefined ? { start: payload.startDate } : {}),
		...(payload.endDate !== undefined ? { end: payload.endDate } : {}),
		...(payload.allDay !== undefined ? { allDay: payload.allDay } : {}),
		...(payload.color !== undefined ? { color: payload.color } : {}),
	}

	mockCalendarEvents = sortEvents(
		mockCalendarEvents.map((event, index) => {
			return index === eventIndex ? updatedEvent : event
		}),
	)

	return updatedEvent
}

export const deleteEvent = async (eventId: string): Promise<void> => {
	mockCalendarEvents = mockCalendarEvents.filter((event) => event.id !== eventId)
}
