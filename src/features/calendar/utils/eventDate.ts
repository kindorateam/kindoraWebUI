const formatLocalDate = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const formatLocalTime = (date: Date): string => {
	return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

const shiftDateStringByDays = (date: string, days: number): string => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
	if (!match) {
		return date
	}

	const [, yearString, monthString, dayString] = match
	const year = Number(yearString)
	const month = Number(monthString)
	const day = Number(dayString)
	const shiftedDate = new Date(Date.UTC(year, month - 1, day + days))
	return shiftedDate.toISOString().slice(0, 10)
}

export const toInclusiveEndDate = (date: string): string => shiftDateStringByDays(date, -1)

export const toExclusiveEndDate = (date: string): string => shiftDateStringByDays(date, 1)

export const parseDateTime = (iso: string | null): { date: string; time: string } => {
	if (!iso) {
		const now = new Date()
		return {
			date: formatLocalDate(now),
			time: formatLocalTime(now),
		}
	}

	if (iso.length === 10) {
		return { date: iso, time: "09:00" }
	}

	return {
		date: iso.slice(0, 10),
		time: iso.slice(11, 16) || "09:00",
	}
}

export const combineDateTime = (date: string, time: string): string => {
	return `${date}T${time}:00`
}
