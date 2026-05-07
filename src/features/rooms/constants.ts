export const MIN_ROOM_AGE_MONTHS = 1
export const MAX_ROOM_AGE_MONTHS = 96 // 8 years

export const ROOM_AGE_OPTIONS = Array.from({ length: MAX_ROOM_AGE_MONTHS - MIN_ROOM_AGE_MONTHS + 1 }, (_, index) => {
	const months = MIN_ROOM_AGE_MONTHS + index
	return { key: String(months) }
})

export const ABSENCE_REASONS = [
	{ key: "sick", labelKey: "rooms.absenceReasons.sick" },
	{ key: "family_emergency", labelKey: "rooms.absenceReasons.familyEmergency" },
	{ key: "vacation", labelKey: "rooms.absenceReasons.vacation" },
	{ key: "medical_appointment", labelKey: "rooms.absenceReasons.medicalAppointment" },
	{ key: "other", labelKey: "rooms.absenceReasons.other" },
]
