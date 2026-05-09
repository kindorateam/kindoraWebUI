import esLocale from "@fullcalendar/core/locales/es"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useTranslation } from "react-i18next"

import { BUSINESS_HOURS, DEFAULT_EVENT_COLOR, SLOT_DURATION, SNAP_DURATION } from "../constants"

import CalendarEventContent, { handleCalendarEventDidMount } from "./CalendarEventContent"

import type { DateSelectArg, DatesSetArg, EventClickArg, EventDropArg } from "@fullcalendar/core"
import type { EventResizeDoneArg } from "@fullcalendar/interaction"
import type { CalendarEvent, CalendarViewType } from "../types"

const MONTH_ROW_COUNT_WITH_HEADER = 6.18
const FULL_DAY_SLOT_MIN_TIME = "00:00:00"
const FULL_DAY_SLOT_MAX_TIME = "24:00:00"
const COMPACT_EVENT_HEIGHT = 44

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
	const { i18n, t } = useTranslation()
	const isMonthView = currentView === "dayGridMonth"
	const fullCalendarLocale = i18n.language.startsWith("es") ? esLocale : undefined
	const monthColumnCount = hideWeekends ? 5 : 7
	const monthAspectRatio = monthColumnCount / MONTH_ROW_COUNT_WITH_HEADER
	const currentTimeFormatter = new Intl.DateTimeFormat(i18n.language, {
		hour: "numeric",
		minute: "2-digit",
	})
	const fullCalendarEvents = events.map((event) => ({
		id: event.id,
		title: event.title,
		start: event.start,
		end: event.end,
		allDay: event.allDay,
		editable: event.displayKind !== "meal",
		backgroundColor: isMonthView ? "transparent" : event.color,
		borderColor: isMonthView ? "transparent" : event.color,
		extendedProps: {
			color: event.color || DEFAULT_EVENT_COLOR,
			description: event.description,
			displayKind: event.displayKind ?? "event",
			sourceId: event.sourceId,
			mealType: event.mealType,
			allergens: event.allergens,
			items: event.items,
		},
	}))

	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
			initialView={currentView}
			headerToolbar={false}
			locale={fullCalendarLocale}
			allDayText={t("calendar.fullCalendar.allDay")}
			moreLinkText={(count) => t("calendar.fullCalendar.more", { count })}
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
			slotMinTime={FULL_DAY_SLOT_MIN_TIME}
			slotMaxTime={FULL_DAY_SLOT_MAX_TIME}
			businessHours={{
				daysOfWeek: [1, 2, 3, 4, 5],
				startTime: BUSINESS_HOURS.startTime,
				endTime: BUSINESS_HOURS.endTime,
			}}
			aspectRatio={isMonthView ? monthAspectRatio : undefined}
			height={isMonthView ? undefined : "calc(100vh - 250px)"}
			expandRows
			eventShortHeight={COMPACT_EVENT_HEIGHT}
			nowIndicator
			nowIndicatorContent={(arg) =>
				arg.isAxis ? (
					<span className="calendar-now-indicator-label">{currentTimeFormatter.format(arg.date)}</span>
				) : null
			}
			eventDisplay="block"
		/>
	)
}

export default CalendarFullView
