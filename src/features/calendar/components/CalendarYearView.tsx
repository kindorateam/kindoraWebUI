import { useTranslation } from "react-i18next"

import { DEFAULT_EVENT_COLOR } from "../constants"

import type React from "react"
import type { CalendarEvent } from "../types"

interface CalendarYearViewProps {
	events: CalendarEvent[]
	hideWeekends: boolean
	onMonthSelect: (date: string) => void
	year: number
}

const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6]

const MONTH_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const BLANK_CELL_KEYS = ["blank-0", "blank-1", "blank-2", "blank-3", "blank-4", "blank-5"]

const formatDateKey = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const parseEventDate = (value: string): Date => {
	if (value.length === 10) {
		return new Date(`${value}T00:00:00`)
	}

	return new Date(value)
}

const getEventsForDay = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
	const dayStart = new Date(date)
	dayStart.setHours(0, 0, 0, 0)

	const dayEnd = new Date(dayStart)
	dayEnd.setDate(dayEnd.getDate() + 1)

	return events.filter((event) => {
		const eventStart = parseEventDate(event.start)
		const eventEnd = parseEventDate(event.end)

		return eventStart < dayEnd && eventEnd > dayStart
	})
}

const getEventCountForMonth = (events: CalendarEvent[], year: number, month: number): number => {
	const monthStart = new Date(year, month, 1)
	const monthEnd = new Date(year, month + 1, 1)

	return events.filter((event) => {
		const eventStart = parseEventDate(event.start)
		const eventEnd = parseEventDate(event.end)

		return eventStart < monthEnd && eventEnd > monthStart
	}).length
}

const getDaysInMonth = (year: number, month: number): Date[] => {
	const date = new Date(year, month, 1)
	const days: Date[] = []

	while (date.getMonth() === month) {
		days.push(new Date(date))
		date.setDate(date.getDate() + 1)
	}

	return days
}

const isToday = (date: Date): boolean => {
	const today = new Date()

	return (
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()
	)
}

const getColumnIndex = (date: Date, hideWeekends: boolean): number => {
	const day = date.getDay()

	if (!hideWeekends) {
		return day
	}

	return day - 1
}

const CalendarYearView = ({ events, hideWeekends, onMonthSelect, year }: CalendarYearViewProps) => {
	const { i18n, t } = useTranslation()
	const locale = i18n.language
	const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long" })
	const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
	const weekdays = WEEKDAY_VALUES.filter((day) => !hideWeekends || (day !== 0 && day !== 6)).map((day) => ({
		label: weekdayFormatter.format(new Date(2024, 0, 7 + day)),
		value: day,
	}))

	return (
		<div className="calendar-year-grid">
			{MONTH_VALUES.map((monthIndex) => {
				const monthName = monthFormatter.format(new Date(year, monthIndex, 1))
				const visibleDays = getDaysInMonth(year, monthIndex).filter((date) => {
					const day = date.getDay()

					return !hideWeekends || (day !== 0 && day !== 6)
				})
				const leadingBlanks = visibleDays[0] ? getColumnIndex(visibleDays[0], hideWeekends) : 0
				const monthEventCount = getEventCountForMonth(events, year, monthIndex)
				const monthDateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`

				return (
					<button
						aria-label={t("calendar.year.openMonth", { month: monthName, year })}
						className="calendar-year-month"
						key={monthDateKey}
						onClick={() => onMonthSelect(monthDateKey)}
						type="button"
					>
						<div className="calendar-year-month__header">
							<h3 className="calendar-year-month__title">{monthName}</h3>
							{monthEventCount > 0 && <span className="calendar-year-month__count">{monthEventCount}</span>}
						</div>
						<div className={`calendar-year-month__weekdays ${hideWeekends ? "grid-cols-5" : "grid-cols-7"}`}>
							{weekdays.map((day) => (
								<div className="calendar-year-weekday" key={day.value}>
									{day.label}
								</div>
							))}
						</div>
						<div className={`calendar-year-month__days ${hideWeekends ? "grid-cols-5" : "grid-cols-7"}`}>
							{BLANK_CELL_KEYS.slice(0, leadingBlanks).map((blankKey) => (
								<div className="calendar-year-day calendar-year-day--blank" key={`${monthDateKey}-${blankKey}`} />
							))}
							{visibleDays.map((date) => {
								const dateKey = formatDateKey(date)
								const dayEvents = getEventsForDay(events, date)
								const eventCount = dayEvents.length
								const eventColor = dayEvents[0]?.color || DEFAULT_EVENT_COLOR
								const dayIsToday = isToday(date)

								return (
									<div
										className={`calendar-year-day ${eventCount > 0 ? "calendar-year-day--has-events" : ""} ${
											dayIsToday ? "calendar-year-day--today" : ""
										}`}
										key={dateKey}
										style={
											{
												"--calendar-year-event-color": eventColor,
											} as React.CSSProperties
										}
									>
										<span className="calendar-year-day__number">{date.getDate()}</span>
										{eventCount > 0 && (
											<span className="calendar-year-day__event-count">{eventCount > 9 ? "9+" : eventCount}</span>
										)}
									</div>
								)
							})}
						</div>
					</button>
				)
			})}
		</div>
	)
}

export default CalendarYearView
