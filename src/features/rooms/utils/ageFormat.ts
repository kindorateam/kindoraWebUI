/**
 * Formats age in months to "Xy Ym" format
 * Omits years if 0, omits months if 0
 * @param months - Age in months
 * @returns Formatted age string (e.g., "2y 3m", "1y", "6m")
 */
export const formatAgeFromMonths = (months: number): string => {
	const years = Math.floor(months / 12)
	const remainingMonths = months % 12

	const parts: string[] = []

	if (years > 0) {
		parts.push(`${years}y`)
	}

	if (remainingMonths > 0) {
		parts.push(`${remainingMonths}m`)
	}

	// If both are 0, show "0m"
	if (parts.length === 0) {
		return "0m"
	}

	return parts.join(" ")
}

/**
 * Formats age range from min/max months
 * @param minMonths - Minimum age in months
 * @param maxMonths - Maximum age in months
 * @returns Formatted age range string (e.g., "2y to 4y", "1y 6m to 3y")
 */
export const formatAgeRange = (minMonths: number, maxMonths: number): string => {
	return `${formatAgeFromMonths(minMonths)} to ${formatAgeFromMonths(maxMonths)}`
}
