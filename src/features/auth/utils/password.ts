import { barColorMap, passwordRequirements, strengthColorMap } from "../constants"

import type { StrengthLabel } from "../constants"

export interface PasswordStrength {
	label: StrengthLabel | "empty"
	barsFilled: number
	colorClass: string
	barColorClass: string
}

export interface RequirementStatus {
	id: string
	label: string
	isMet: boolean
}

/**
 * Get requirement statuses for a password
 */
export const getRequirementStatuses = (password: string): RequirementStatus[] => {
	return passwordRequirements.map((requirement) => ({
		id: requirement.id,
		label: requirement.label,
		isMet: requirement.test(password),
	}))
}

/**
 * Calculate password strength based on met requirements
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
	const statuses = getRequirementStatuses(password)
	const completedCount = statuses.filter((r) => r.isMet).length

	if (!password) {
		return {
			label: "empty",
			barsFilled: 0,
			colorClass: strengthColorMap.empty,
			barColorClass: barColorMap.empty,
		}
	}

	if (completedCount <= 1) {
		return {
			label: "weak",
			barsFilled: 1,
			colorClass: strengthColorMap.weak,
			barColorClass: barColorMap.weak,
		}
	}

	if (completedCount === 2) {
		return {
			label: "fair",
			barsFilled: 2,
			colorClass: strengthColorMap.fair,
			barColorClass: barColorMap.fair,
		}
	}

	if (completedCount === 3) {
		return {
			label: "good",
			barsFilled: 3,
			colorClass: strengthColorMap.good,
			barColorClass: barColorMap.good,
		}
	}

	return {
		label: "strong",
		barsFilled: 4,
		colorClass: strengthColorMap.strong,
		barColorClass: barColorMap.strong,
	}
}
