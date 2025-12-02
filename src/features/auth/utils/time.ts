import { CODE_EXPIRATION_SECONDS, RESEND_COOLDOWN_SECONDS } from "../constants"

/**
 * Calculate remaining time until code expires
 */
export const calculateTimeLeft = (codeSentAt: number | null): number => {
	if (!codeSentAt) return CODE_EXPIRATION_SECONDS
	const elapsed = Math.floor((Date.now() - codeSentAt) / 1000)
	return Math.max(0, CODE_EXPIRATION_SECONDS - elapsed)
}

/**
 * Calculate remaining time until resend is allowed
 */
export const calculateResendTimeLeft = (codeSentAt: number | null): number => {
	if (!codeSentAt) return 0
	const elapsed = Math.floor((Date.now() - codeSentAt) / 1000)
	return Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed)
}

/**
 * Format seconds as MM:SS
 */
export const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}
