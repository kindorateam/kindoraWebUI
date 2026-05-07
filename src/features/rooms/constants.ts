export const MIN_ROOM_AGE_MONTHS = 1
export const MAX_ROOM_AGE_MONTHS = 96 // 8 years

/**
 * Formats age in months to a human-readable string
 * Examples: "1 month", "6 months", "1 year", "1 year 3 months", "2 years"
 */
export const formatAgeLabel = (months: number): string => {
	const years = Math.floor(months / 12)
	const remainingMonths = months % 12

	if (years === 0) {
		return `${months} ${months === 1 ? "month" : "months"}`
	}

	if (remainingMonths === 0) {
		return `${years} ${years === 1 ? "year" : "years"}`
	}

	const yearPart = `${years} ${years === 1 ? "year" : "years"}`
	const monthPart = `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`
	return `${yearPart} ${monthPart}`
}

export const ROOM_AGE_OPTIONS = Array.from({ length: MAX_ROOM_AGE_MONTHS - MIN_ROOM_AGE_MONTHS + 1 }, (_, index) => {
	const months = MIN_ROOM_AGE_MONTHS + index
	return { key: String(months), label: formatAgeLabel(months) }
})

export const ABSENCE_REASONS = [
	{ key: "sick", label: "Sick", labelKey: "rooms.absenceReasons.sick" },
	{ key: "family_emergency", label: "Family emergency", labelKey: "rooms.absenceReasons.familyEmergency" },
	{ key: "vacation", label: "Vacation", labelKey: "rooms.absenceReasons.vacation" },
	{ key: "medical_appointment", label: "Medical appointment", labelKey: "rooms.absenceReasons.medicalAppointment" },
	{ key: "other", label: "Other", labelKey: "rooms.absenceReasons.other" },
]
