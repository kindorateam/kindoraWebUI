import type { CalendarViewType } from "./types"

export const CALENDAR_VIEW_OPTIONS: { key: CalendarViewType; label: string }[] = [
	{ key: "timeGridDay", label: "Day" },
	{ key: "timeGridWeek", label: "Week" },
	{ key: "dayGridMonth", label: "Month" },
	{ key: "multiMonthYear", label: "Year" },
]

export const DEFAULT_EVENT_COLOR = "#006FEE"

export const EVENT_COLOR_OPTIONS = [
	{ key: "#006FEE", label: "Blue" },
	{ key: "#17C964", label: "Green" },
	{ key: "#F5A524", label: "Yellow" },
	{ key: "#F31260", label: "Red" },
	{ key: "#7828C8", label: "Purple" },
	{ key: "#71717A", label: "Gray" },
]

export const SLOT_DURATION = "00:30:00"

export const SNAP_DURATION = "00:15:00"

export const BUSINESS_HOURS = {
	startTime: "07:00",
	endTime: "19:00",
}
