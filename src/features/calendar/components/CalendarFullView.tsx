import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"

import { BUSINESS_HOURS, DEFAULT_EVENT_COLOR, SLOT_DURATION, SNAP_DURATION } from "../constants"

import CalendarEventContent, { handleCalendarEventDidMount } from "./CalendarEventContent"

import type { DateSelectArg, DatesSetArg, EventClickArg, EventDropArg } from "@fullcalendar/core"
import type { EventResizeDoneArg } from "@fullcalendar/interaction"
import type { CalendarEvent, CalendarViewType } from "../types"

const MONTH_ROW_COUNT_WITH_HEADER = 6.18

interface CalendarFullViewProps {
	calendarRef: React.RefObject<FullCalendar | null>
	currentView: CalendarViewType
	events: CalendarEvent[]
	hideWeekends: boolean
	onDateSelect: (selectInfo: DateSelectArg) => void
	onDatesSet: (arg: DatesSetArg) => void
	onEventClick: (clickInfo: EventClickArg) => void
	onEventDrop: (dropInfo: EventDropArg) => void
	onEventResize: (resizeInfo: EventResizeDoneArg) => void
}

const CalendarFullView = ({
	calendarRef,
	currentView,
	events,
	hideWeekends,
	onDateSelect,
	onDatesSet,
	onEventClick,
	onEventDrop,
	onEventResize,
}: CalendarFullViewProps) => {
	const isMonthView = currentView === "dayGridMonth"
	const monthColumnCount = hideWeekends ? 5 : 7
	const monthAspectRatio = monthColumnCount / MONTH_ROW_COUNT_WITH_HEADER
	const fullCalendarEvents = events.map((event) => ({
		id: event.id,
		title: event.title,
		start: event.start,
		end: event.end,
		allDay: event.allDay,
		backgroundColor: isMonthView ? "transparent" : event.color,
		borderColor: isMonthView ? "transparent" : event.color,
		extendedProps: {
			color: event.color || DEFAULT_EVENT_COLOR,
			description: event.description,
		},
	}))

	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
			initialView={currentView}
			headerToolbar={false}
			weekends={!hideWeekends}
			editable
			eventResizableFromStart
			selectable
			selectMirror
			dayHeaderFormat={isMonthView ? { weekday: "short" } : undefined}
			dayMaxEvents
			events={fullCalendarEvents}
			datesSet={onDatesSet}
			eventContent={(eventInfo) => <CalendarEventContent eventInfo={eventInfo} />}
			eventDidMount={handleCalendarEventDidMount}
			select={onDateSelect}
			eventClick={onEventClick}
			eventDrop={onEventDrop}
			eventResize={onEventResize}
			slotDuration={SLOT_DURATION}
			snapDuration={SNAP_DURATION}
			progressiveEventRendering
			slotMinTime="06:00:00"
			slotMaxTime="19:00:00"
			businessHours={{
				daysOfWeek: [1, 2, 3, 4, 5],
				startTime: BUSINESS_HOURS.startTime,
				endTime: BUSINESS_HOURS.endTime,
			}}
			aspectRatio={isMonthView ? monthAspectRatio : undefined}
			height={isMonthView ? undefined : "calc(100vh - 250px)"}
			expandRows
			nowIndicator
			eventDisplay="block"
		/>
	)
}

export default CalendarFullView
