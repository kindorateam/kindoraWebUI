import { Spinner, toast } from "@heroui/react"
import { useAtom, useAtomValue } from "jotai"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import TableError from "@/components/TableError"
import { getErrorMessage } from "@/utils/error"

import { useCalendarEvents, useUpdateEvent } from "../hooks/useCalendar"
import { useCalendarNavigation } from "../hooks/useCalendarNavigation"
import { calendarViewAtom, dateRangeAtom, hideWeekendsAtom } from "../stores/calendarSettings.store"
import { openCreateEventModal, openEditEventModal } from "../stores/eventModal.store"

import CalendarFullView from "./CalendarFullView"
import CalendarToolbar from "./CalendarToolbar"
import CalendarYearView from "./CalendarYearView"

import type { DateSelectArg, EventClickArg, EventDropArg } from "@fullcalendar/core"
import type { EventResizeDoneArg } from "@fullcalendar/interaction"
import type FullCalendar from "@fullcalendar/react"
import type { CalendarViewType } from "../types"

import "./calendar.css"

const closeMorePopover = () => {
	document.querySelector<HTMLElement>(".fc-more-popover .fc-popover-close")?.click()
}

const CalendarView = () => {
	const { t } = useTranslation()
	const calendarRef = useRef<FullCalendar>(null)
	const [currentView, setCurrentView] = useAtom(calendarViewAtom)
	const hideWeekends = useAtomValue(hideWeekendsAtom)
	const dateRange = useAtomValue(dateRangeAtom)
	const updateEventMutation = useUpdateEvent()
	const { handleDatesSet, handleNext, handlePrev, handleToday, handleYearMonthSelect, isYearView, title, visibleYear } =
		useCalendarNavigation({
			calendarRef,
			currentView,
			setCurrentView: (view: CalendarViewType) => setCurrentView(view),
		})

	const {
		data: events = [],
		error,
		isLoading,
		refetch,
	} = useCalendarEvents({
		start: dateRange.start,
		end: dateRange.end,
	})

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		openCreateEventModal({
			start: selectInfo.startStr,
			end: selectInfo.endStr,
			allDay: selectInfo.allDay,
		})
		selectInfo.view.calendar.unselect()
	}

	const handleEventClick = (clickInfo: EventClickArg) => {
		const matchedEvent = events.find((event) => event.id === clickInfo.event.id)
		if (matchedEvent) {
			closeMorePopover()
			openEditEventModal(matchedEvent)
		}
	}

	const handleEventDrop = (dropInfo: EventDropArg) => {
		updateEventMutation.mutate(
			{
				eventId: dropInfo.event.id,
				payload: {
					startDate: dropInfo.event.startStr,
					endDate: dropInfo.event.endStr,
					allDay: dropInfo.event.allDay,
				},
			},
			{
				onError: (error) => {
					dropInfo.revert()
					toast(t("calendar.toast.moveFailed"), {
						description: getErrorMessage(error),
						variant: "danger",
					})
				},
			},
		)
	}

	const handleEventResize = (resizeInfo: EventResizeDoneArg) => {
		updateEventMutation.mutate(
			{
				eventId: resizeInfo.event.id,
				payload: {
					startDate: resizeInfo.event.startStr,
					endDate: resizeInfo.event.endStr,
				},
			},
			{
				onError: (error) => {
					resizeInfo.revert()
					toast(t("calendar.toast.resizeFailed"), {
						description: getErrorMessage(error),
						variant: "danger",
					})
				},
			},
		)
	}

	const showInitialError = !!error && events.length === 0
	const showInitialLoading = isLoading && events.length === 0

	return (
		<div className="rounded-lg bg-white shadow-sm">
			<CalendarToolbar
				title={title}
				onNavigatePrev={handlePrev}
				onNavigateNext={handleNext}
				onNavigateToday={handleToday}
			/>
			<div className="calendar-surface relative">
				{isYearView ? (
					<CalendarYearView
						events={events}
						hideWeekends={hideWeekends}
						onMonthSelect={handleYearMonthSelect}
						year={visibleYear}
					/>
				) : (
					<CalendarFullView
						calendarRef={calendarRef}
						currentView={currentView}
						events={events}
						hideWeekends={hideWeekends}
						onDateSelect={handleDateSelect}
						onDatesSet={handleDatesSet}
						onEventClick={handleEventClick}
						onEventDrop={handleEventDrop}
						onEventResize={handleEventResize}
					/>
				)}
				{showInitialLoading && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
						<Spinner />
					</div>
				)}
				{showInitialError && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 p-4 backdrop-blur-sm">
						<TableError onRetry={() => void refetch()} />
					</div>
				)}
			</div>
		</div>
	)
}

export default CalendarView
