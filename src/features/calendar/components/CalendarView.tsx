import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import multiMonthPlugin from "@fullcalendar/multimonth"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Spinner, addToast } from "@heroui/react"
import { useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"

import TableError from "@/components/TableError"
import { getErrorMessage } from "@/utils/error"

import { BUSINESS_HOURS, SLOT_DURATION, SNAP_DURATION } from "../constants"
import { useCalendarEvents, useUpdateEvent } from "../hooks/useCalendar"
import { calendarViewAtom, dateRangeAtom, hideWeekendsAtom, setDateRange } from "../stores/calendarSettings.store"
import { openCreateEventModal, openEditEventModal } from "../stores/eventModal.store"

import CalendarToolbar from "./CalendarToolbar"

import type { DateSelectArg, DatesSetArg, EventClickArg, EventDropArg } from "@fullcalendar/core"
import type { EventResizeDoneArg } from "@fullcalendar/interaction"

import "./calendar.css"

const CalendarView = () => {
	const calendarRef = useRef<FullCalendar>(null)
	const [currentView, setCurrentView] = useAtom(calendarViewAtom)
	const hideWeekends = useAtomValue(hideWeekendsAtom)
	const dateRange = useAtomValue(dateRangeAtom)
	const [title, setTitle] = useState("")

	const {
		data: events = [],
		error,
		isLoading,
		refetch,
	} = useCalendarEvents({
		start: dateRange.start,
		end: dateRange.end,
	})
	const updateEventMutation = useUpdateEvent()

	const fullCalendarEvents = events.map((event) => ({
		id: event.id,
		title: event.title,
		start: event.start,
		end: event.end,
		allDay: event.allDay,
		backgroundColor: event.color,
		borderColor: event.color,
		extendedProps: {
			description: event.description,
		},
	}))

	const handleDatesSet = useCallback(
		(arg: DatesSetArg) => {
			setDateRange(arg.startStr, arg.endStr)
			setTitle(arg.view.title)

			// Sync view type from FullCalendar back to store (e.g., when using browser navigation)
			if (arg.view.type !== currentView) {
				setCurrentView(arg.view.type as typeof currentView)
			}
		},
		[currentView, setCurrentView],
	)

	const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
		openCreateEventModal({
			start: selectInfo.startStr,
			end: selectInfo.endStr,
			allDay: selectInfo.allDay,
		})
		selectInfo.view.calendar.unselect()
	}, [])

	const handleEventClick = useCallback(
		(clickInfo: EventClickArg) => {
			const matchedEvent = events.find((e) => e.id === clickInfo.event.id)
			if (matchedEvent) {
				openEditEventModal(matchedEvent)
			}
		},
		[events],
	)

	const handleEventDrop = useCallback(
		(dropInfo: EventDropArg) => {
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
						addToast({
							title: "Failed to move event",
							description: getErrorMessage(error),
							color: "danger",
						})
					},
				},
			)
		},
		[updateEventMutation],
	)

	const handleEventResize = useCallback(
		(resizeInfo: EventResizeDoneArg) => {
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
						addToast({
							title: "Failed to resize event",
							description: getErrorMessage(error),
							color: "danger",
						})
					},
				},
			)
		},
		[updateEventMutation],
	)

	useEffect(() => {
		const calendarApi = calendarRef.current?.getApi()
		if (calendarApi && calendarApi.view.type !== currentView) {
			calendarApi.changeView(currentView)
		}
	}, [currentView])

	const handlePrev = () => calendarRef.current?.getApi().prev()
	const handleNext = () => calendarRef.current?.getApi().next()
	const handleToday = () => calendarRef.current?.getApi().today()
	const showInitialError = !!error && events.length === 0
	const showInitialLoading = isLoading && events.length === 0

	return (
		<div>
			<CalendarToolbar
				title={title}
				onNavigatePrev={handlePrev}
				onNavigateNext={handleNext}
				onNavigateToday={handleToday}
			/>
			<div className="relative">
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
					initialView={currentView}
					headerToolbar={false}
					weekends={!hideWeekends}
					editable
					selectable
					selectMirror
					dayMaxEvents
					events={fullCalendarEvents}
					datesSet={handleDatesSet}
					select={handleDateSelect}
					eventClick={handleEventClick}
					eventDrop={handleEventDrop}
					eventResize={handleEventResize}
					slotDuration={SLOT_DURATION}
					snapDuration={SNAP_DURATION}
					businessHours={{
						daysOfWeek: [1, 2, 3, 4, 5],
						startTime: BUSINESS_HOURS.startTime,
						endTime: BUSINESS_HOURS.endTime,
					}}
					height="auto"
					nowIndicator
					eventDisplay="block"
					multiMonthMaxColumns={3}
				/>
				{showInitialLoading && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
						<Spinner label="Loading events..." />
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
