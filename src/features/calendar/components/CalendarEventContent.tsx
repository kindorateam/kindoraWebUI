import { DEFAULT_EVENT_COLOR } from "../constants"

import type { EventContentArg, EventMountArg } from "@fullcalendar/core"
import type React from "react"

const EVENT_TINTS: Record<string, string> = {
	"#006FEE": "#dcecff",
	"#17C964": "#cdeedb",
	"#F5A524": "#fde4c1",
	"#F31260": "#ffd8e5",
	"#7828C8": "#eadcf7",
	"#71717A": "#e5e5e8",
}

const getEventTint = (color: string): string => EVENT_TINTS[color.toUpperCase()] ?? `${color}24`

const getEventColor = (eventInfo: EventContentArg | EventMountArg): string => {
	return String(eventInfo.event.extendedProps.color || eventInfo.event.backgroundColor || DEFAULT_EVENT_COLOR)
}

export const handleCalendarEventDidMount = (eventInfo: EventMountArg) => {
	const color = getEventColor(eventInfo)

	if (eventInfo.view.type === "dayGridMonth") {
		eventInfo.el.style.backgroundColor = "transparent"
		eventInfo.el.style.borderColor = "transparent"
		eventInfo.el.style.boxShadow = "none"
		return
	}

	eventInfo.el.style.setProperty("--calendar-event-color", color)
	eventInfo.el.style.setProperty("--calendar-event-bg", getEventTint(color))
	eventInfo.el.style.backgroundColor = getEventTint(color)
	eventInfo.el.style.borderColor = "transparent"
	eventInfo.el.style.boxShadow = "none"
}

interface CalendarEventContentProps {
	eventInfo: EventContentArg
}

const CalendarEventContent = ({ eventInfo }: CalendarEventContentProps) => {
	const color = getEventColor(eventInfo)
	const style = {
		"--calendar-event-color": color,
		"--calendar-event-bg": getEventTint(color),
	} as React.CSSProperties

	if (eventInfo.view.type !== "dayGridMonth") {
		return (
			<div className="calendar-event-default" style={style}>
				<span aria-hidden="true" className="calendar-event-default__rail" />
				{eventInfo.timeText && <span className="calendar-event-default__time">{eventInfo.timeText}</span>}
				<span className="calendar-event-default__title">{eventInfo.event.title}</span>
			</div>
		)
	}

	if (!eventInfo.event.allDay) {
		return (
			<div className="calendar-month-event calendar-month-event--timed" style={style}>
				<span aria-hidden="true" className="calendar-month-event__rail" />
				<span className="calendar-month-event__title">{eventInfo.event.title}</span>
				{eventInfo.timeText && <span className="calendar-month-event__time">{eventInfo.timeText}</span>}
			</div>
		)
	}

	return (
		<div className="calendar-month-event calendar-month-event--all-day" style={style}>
			<span aria-hidden="true" className="calendar-month-event__dot" />
			<span className="calendar-month-event__title">{eventInfo.event.title}</span>
		</div>
	)
}

export default CalendarEventContent
