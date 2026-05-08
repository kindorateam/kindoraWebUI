import type { CalendarViewType, EventRepeatFrequency } from "./types"

export const CALENDAR_VIEW_OPTIONS: { key: CalendarViewType; labelKey: string }[] = [
	{ key: "timeGridDay", labelKey: "calendar.views.day" },
	{ key: "timeGridWeek", labelKey: "calendar.views.week" },
	{ key: "dayGridMonth", labelKey: "calendar.views.month" },
	{ key: "multiMonthYear", labelKey: "calendar.views.year" },
]

export const DEFAULT_EVENT_COLOR = "#006FEE"

export const EVENT_COLOR_OPTIONS = [
	{ key: "#006FEE", labelKey: "calendar.colors.blue" },
	{ key: "#17C964", labelKey: "calendar.colors.green" },
	{ key: "#F5A524", labelKey: "calendar.colors.yellow" },
	{ key: "#F31260", labelKey: "calendar.colors.red" },
	{ key: "#7828C8", labelKey: "calendar.colors.purple" },
	{ key: "#71717A", labelKey: "calendar.colors.gray" },
]

export const EVENT_REPEAT_OPTIONS: { key: EventRepeatFrequency; labelKey: string }[] = [
	{ key: "none", labelKey: "calendar.repeat.none" },
	{ key: "daily", labelKey: "calendar.repeat.daily" },
	{ key: "weekly", labelKey: "calendar.repeat.weekly" },
	{ key: "monthly", labelKey: "calendar.repeat.monthly" },
	{ key: "yearly", labelKey: "calendar.repeat.yearly" },
]

export const SLOT_DURATION = "00:30:00"

export const SNAP_DURATION = "00:15:00"

export const BUSINESS_HOURS = {
	startTime: "07:00",
	endTime: "19:00",
}
