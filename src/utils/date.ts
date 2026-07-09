import { parseDate } from "@internationalized/date"

import type { DateValue } from "@internationalized/date"

export const parseDateValue = (value: string | null | undefined): DateValue | null => {
	if (!value) return null

	try {
		return parseDate(value)
	} catch {
		return null
	}
}

export const serializeDateValue = (value: DateValue | null): string | undefined => value?.toString()

export const formatShortDate = (value: string | null | undefined, locale: string, fallback: string): string => {
	if (!value) return fallback

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return fallback

	return date.toLocaleDateString(locale, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	})
}
