import { barColorMap, passwordRequirements, strengthColorMap, strengthLabelMap } from "../constants"

import type { StrengthLabel } from "../constants"

export interface PasswordStrength {
	label: StrengthLabel
	displayLabel: string
	barsFilled: number
	colorClass: string
	barColorClass: string
}

export interface RequirementStatus {
	id: string
	label: string
	isMet: boolean
	required: boolean
}

/**
 * Get requirement statuses for a password
 */
export const getRequirementStatuses = (password: string): RequirementStatus[] => {
	return passwordRequirements.map((requirement) => ({
		id: requirement.id,
		label: requirement.label,
		isMet: requirement.test(password),
		required: requirement.required,
	}))
}

/**
 * Check if all required password requirements are met
 */
export const areRequiredRequirementsMet = (password: string): boolean => {
	return passwordRequirements.filter((req) => req.required).every((req) => req.test(password))
}

/**
 * Calculate password strength based on met requirements
 * 5 requirements total, 5 bars:
 * - 1-2 met = Weak (1-2 bars)
 * - 3 met = Average (3 bars)
 * - 4 met = Strong (4 bars)
 * - 5 met = Super Strong (5 bars)
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
	const statuses = getRequirementStatuses(password)
	const completedCount = statuses.filter((r) => r.isMet).length

	if (completedCount <= 2) {
		return {
			label: "weak",
			displayLabel: strengthLabelMap.weak,
			barsFilled: completedCount,
			colorClass: strengthColorMap.weak,
			barColorClass: barColorMap.weak,
		}
	}

	if (completedCount === 3) {
		return {
			label: "average",
			displayLabel: strengthLabelMap.average,
			barsFilled: 3,
			colorClass: strengthColorMap.average,
			barColorClass: barColorMap.average,
		}
	}

	if (completedCount === 4) {
		return {
			label: "strong",
			displayLabel: strengthLabelMap.strong,
			barsFilled: 4,
			colorClass: strengthColorMap.strong,
			barColorClass: barColorMap.strong,
		}
	}

	return {
		label: "superStrong",
		displayLabel: strengthLabelMap.superStrong,
		barsFilled: 5,
		colorClass: strengthColorMap.superStrong,
		barColorClass: barColorMap.superStrong,
	}
}
