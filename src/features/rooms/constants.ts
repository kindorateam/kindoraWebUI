export const MIN_ROOM_AGE = 0
export const MAX_ROOM_AGE = 7

export const ROOM_AGE_OPTIONS = Array.from({ length: MAX_ROOM_AGE - MIN_ROOM_AGE + 1 }, (_, index) => {
	const age = MIN_ROOM_AGE + index
	return { key: String(age), label: `${age} ${age === 1 ? "year" : "years"}` }
})

export const ABSENCE_REASONS = [
	{ key: "sick", label: "Sick" },
	{ key: "family_emergency", label: "Family emergency" },
	{ key: "vacation", label: "Vacation" },
	{ key: "medical_appointment", label: "Medical appointment" },
	{ key: "other", label: "Other" },
]
