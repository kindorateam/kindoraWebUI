import { useEffect, useState } from "react"

import { setDateRange } from "../stores/calendarSettings.store"

import type { DatesSetArg } from "@fullcalendar/core"
import type FullCalendar from "@fullcalendar/react"
import type { CalendarViewType } from "../types"

interface UseCalendarNavigationOptions {
	calendarRef: React.RefObject<FullCalendar | null>
	currentView: CalendarViewType
	setCurrentView: (view: CalendarViewType) => void
}

export const useCalendarNavigation = ({ calendarRef, currentView, setCurrentView }: UseCalendarNavigationOptions) => {
	const [title, setTitle] = useState("")
	const [yearDate, setYearDate] = useState(() => new Date())
	const [targetMonthDate, setTargetMonthDate] = useState<string | null>(null)
	const isYearView = currentView === "multiMonthYear"
	const visibleYear = yearDate.getFullYear()

	const handleDatesSet = (arg: DatesSetArg) => {
		setDateRange(arg.startStr, arg.endStr)
		setTitle(arg.view.title)

		if (arg.view.type !== currentView) {
			setCurrentView(arg.view.type as CalendarViewType)
		}
	}

	useEffect(() => {
		const calendarApi = calendarRef.current?.getApi()
		if (isYearView) {
			const calendarDate = calendarApi?.getDate()

			if (calendarDate && calendarDate.getFullYear() !== visibleYear) {
				setYearDate(calendarDate)
			}

			return
		}

		if (calendarApi && (calendarApi.view.type !== currentView || targetMonthDate)) {
			calendarApi.changeView(currentView, targetMonthDate || undefined)
			setTargetMonthDate(null)
		}
	}, [calendarRef, currentView, isYearView, targetMonthDate, visibleYear])

	useEffect(() => {
		if (!isYearView) return

		setTitle(String(visibleYear))
		setDateRange(`${visibleYear}-01-01`, `${visibleYear + 1}-01-01`)
	}, [isYearView, visibleYear])

	const handlePrev = () => {
		if (isYearView) {
			setYearDate((date) => new Date(date.getFullYear() - 1, 0, 1))
			return
		}

		calendarRef.current?.getApi().prev()
	}

	const handleNext = () => {
		if (isYearView) {
			setYearDate((date) => new Date(date.getFullYear() + 1, 0, 1))
			return
		}

		calendarRef.current?.getApi().next()
	}

	const handleToday = () => {
		if (isYearView) {
			setYearDate(new Date())
			return
		}

		calendarRef.current?.getApi().today()
	}

	const handleYearMonthSelect = (date: string) => {
		setTargetMonthDate(date)
		setCurrentView("dayGridMonth")
	}

	return {
		handleDatesSet,
		handleNext,
		handlePrev,
		handleToday,
		handleYearMonthSelect,
		isYearView,
		title,
		visibleYear,
	}
}
