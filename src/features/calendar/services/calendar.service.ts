import { DEFAULT_EVENT_COLOR } from "../constants"

import type {
	CalendarEvent,
	CreateEventPayload,
	DeleteEventPayload,
	GetEventsParams,
	UpdateEventPayload,
} from "../types"

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

const addMonths = (date: Date, months: number): Date => {
	const nextDate = new Date(date)
	nextDate.setMonth(nextDate.getMonth() + months)
	return nextDate
}

const addYears = (date: Date, years: number): Date => {
	const nextDate = new Date(date)
	nextDate.setFullYear(nextDate.getFullYear() + years)
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

const createTodayLoadTestEvents = (today: Date): CalendarEvent[] => [
	createTimedEvent(
		"calendar-today-1",
		"Arrival support",
		setTime(today, 7, 45),
		setTime(today, 8, 15),
		"Extra front-desk coverage for morning drop-off.",
		"#17C964",
	),
	createTimedEvent(
		"calendar-today-2",
		"Infant room check-in",
		setTime(today, 8, 0),
		setTime(today, 8, 30),
		"Quick review of infant classroom ratios.",
		"#006FEE",
	),
	createTimedEvent(
		"calendar-today-3",
		"Kitchen delivery",
		setTime(today, 8, 45),
		setTime(today, 9, 15),
		"Weekly produce delivery window.",
		"#F5A524",
	),
	createTimedEvent(
		"calendar-today-4",
		"Music circle",
		setTime(today, 9, 15),
		setTime(today, 9, 45),
		"Guest music session in the toddler room.",
		"#7828C8",
	),
	createTimedEvent(
		"calendar-today-5",
		"Fire drill",
		setTime(today, 10, 0),
		setTime(today, 10, 15),
		"Monthly safety drill.",
		"#F31260",
	),
	createTimedEvent(
		"calendar-today-6",
		"Classroom photos",
		setTime(today, 10, 15),
		setTime(today, 11, 0),
		"Photo make-up session.",
		"#71717A",
	),
	createTimedEvent(
		"calendar-today-7",
		"Outdoor play rotation",
		setTime(today, 10, 45),
		setTime(today, 11, 30),
		"Playground schedule adjustment.",
		"#17C964",
	),
	createTimedEvent(
		"calendar-today-8",
		"Family tour",
		setTime(today, 11, 0),
		setTime(today, 11, 45),
		"Prospective family tour.",
		"#006FEE",
	),
	createTimedEvent(
		"calendar-today-9",
		"Lunch prep review",
		setTime(today, 11, 30),
		setTime(today, 12, 0),
		"Menu and allergy check.",
		"#F5A524",
	),
	createTimedEvent(
		"calendar-today-10",
		"Nap coverage",
		setTime(today, 12, 15),
		setTime(today, 13, 0),
		"Coverage swap during nap setup.",
		"#7828C8",
	),
	createTimedEvent(
		"calendar-today-11",
		"Supply inventory",
		setTime(today, 13, 30),
		setTime(today, 14, 0),
		"Classroom supply count.",
		"#71717A",
	),
	createTimedEvent(
		"calendar-today-12",
		"Pre-K assessment",
		setTime(today, 14, 0),
		setTime(today, 14, 45),
		"Small group observation block.",
		"#17C964",
	),
	createTimedEvent(
		"calendar-today-13",
		"Staff coaching",
		setTime(today, 14, 30),
		setTime(today, 15, 15),
		"Classroom coaching follow-up.",
		"#006FEE",
	),
	createTimedEvent(
		"calendar-today-14",
		"Dismissal notes",
		setTime(today, 16, 30),
		setTime(today, 17, 0),
		"End-of-day family notes.",
		"#F31260",
	),
]

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
		...createTodayLoadTestEvents(today),
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

const getBaseEventId = (eventId: string): string => eventId.split("__repeat__")[0] ?? eventId

const getRepeatDate = (date: Date, frequency: CreateEventPayload["repeatFrequency"], index: number): Date => {
	if (frequency === "daily") return addDays(date, index)
	if (frequency === "weekly") return addDays(date, index * 7)
	if (frequency === "monthly") return addMonths(date, index)
	if (frequency === "yearly") return addYears(date, index)

	return date
}

const formatEventDate = (date: Date, allDay: boolean): string => {
	return allDay ? toLocalDateString(date) : toLocalDateTimeString(date)
}

const getEventOccurrence = (event: CalendarEvent, occurrenceIndex: number): CalendarEvent => {
	const repeatFrequency = event.repeatFrequency ?? "none"
	const start = getRepeatDate(parseDateValue(event.start), repeatFrequency, occurrenceIndex)
	const end = getRepeatDate(parseDateValue(event.end), repeatFrequency, occurrenceIndex)
	const occurrenceKey = formatEventDate(start, event.allDay).replaceAll(":", "")

	return {
		...event,
		id: occurrenceIndex === 0 ? event.id : `${event.id}__repeat__${occurrenceKey}`,
		start: formatEventDate(start, event.allDay),
		end: formatEventDate(end, event.allDay),
	}
}

const expandEventForRange = (event: CalendarEvent, range: GetEventsParams): CalendarEvent[] => {
	if (!event.repeatFrequency || event.repeatFrequency === "none") {
		return overlapsRange(event, range) ? [event] : []
	}

	const rangeEnd = parseDateValue(range.end)
	const occurrences: CalendarEvent[] = []
	let occurrenceIndex = 0

	while (true) {
		const occurrence = getEventOccurrence(event, occurrenceIndex)
		const occurrenceStart = parseDateValue(occurrence.start)
		const isExcluded = event.excludedDates?.includes(occurrence.start) ?? false

		if (occurrenceStart >= rangeEnd) {
			break
		}

		if (!isExcluded && overlapsRange(occurrence, range)) {
			occurrences.push(occurrence)
		}

		occurrenceIndex += 1
	}

	return occurrences
}

let mockCalendarEvents: CalendarEvent[] = createMockEvents()

export const getEvents = async (params: GetEventsParams): Promise<CalendarEvent[]> => {
	return sortEvents(mockCalendarEvents.flatMap((event) => expandEventForRange(event, params)))
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
		repeatFrequency: payload.repeatFrequency ?? "none",
		excludedDates: [],
	}

	mockCalendarEvents = sortEvents([...mockCalendarEvents, event])

	return event
}

export const updateEvent = async (eventId: string, payload: UpdateEventPayload): Promise<CalendarEvent> => {
	const baseEventId = getBaseEventId(eventId)
	const eventIndex = mockCalendarEvents.findIndex((event) => event.id === baseEventId)

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

export const deleteEvent = async ({
	eventId,
	occurrenceStart,
	scope = "series",
}: DeleteEventPayload): Promise<void> => {
	const baseEventId = getBaseEventId(eventId)

	if (scope === "occurrence" && occurrenceStart) {
		mockCalendarEvents = sortEvents(
			mockCalendarEvents.map((event) => {
				if (event.id !== baseEventId) return event

				return {
					...event,
					excludedDates: Array.from(new Set([...(event.excludedDates ?? []), occurrenceStart])),
				}
			}),
		)
		return
	}

	mockCalendarEvents = mockCalendarEvents.filter((event) => event.id !== baseEventId)
}
