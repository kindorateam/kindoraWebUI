import axios from "axios"

import type { AppError, ErrorSeverity } from "@/types/error"

export class ApplicationError extends Error implements AppError {
	code?: string
	severity?: ErrorSeverity
	context?: Record<string, unknown>
	timestamp: string
	userMessage?: string

	constructor(
		message: string,
		options?: {
			code?: string
			severity?: ErrorSeverity
			context?: Record<string, unknown>
			userMessage?: string
			cause?: unknown
		},
	) {
		super(message, { cause: options?.cause })
		this.name = "ApplicationError"
		this.code = options?.code
		this.severity = options?.severity ?? "medium"
		this.context = options?.context
		this.timestamp = new Date().toISOString()
		this.userMessage = options?.userMessage ?? "An unexpected error occurred"

		// Maintain proper stack trace for where our error was thrown
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApplicationError)
		}
	}
}

export const isApplicationError = (error: unknown): error is ApplicationError => {
	return error instanceof ApplicationError
}

export const getErrorMessage = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		const responseData: unknown = error.response?.data
		if (responseData && typeof responseData === "object" && "message" in responseData) {
			const message = responseData.message
			if (typeof message === "string" && message.length > 0) {
				return message
			}
		}
	}
	if (error instanceof Error) {
		return error.message
	}
	if (typeof error === "string") {
		return error
	}
	return "An unknown error occurred"
}

export const getErrorCode = (error: unknown): string | undefined => {
	if (isApplicationError(error)) {
		return error.code
	}
	if (error && typeof error === "object" && "code" in error) {
		return String(error.code)
	}
	return undefined
}

export const getErrorSeverity = (error: unknown): ErrorSeverity => {
	if (isApplicationError(error)) {
		return error.severity ?? "medium"
	}
	return "medium"
}

export const getUserMessage = (error: unknown): string => {
	if (isApplicationError(error) && error.userMessage) {
		return error.userMessage
	}
	return "An unexpected error occurred. Please try again."
}

export const logError = (error: unknown, context?: Record<string, unknown>): void => {
	const errorInfo = {
		message: getErrorMessage(error),
		code: getErrorCode(error),
		severity: getErrorSeverity(error),
		timestamp: new Date().toISOString(),
		context,
		stack: error instanceof Error ? error.stack : undefined,
	}

	// In development, log to console
	if (import.meta.env.DEV) {
		console.error("Error logged:", errorInfo)
	}

	// TODO: In production, send to error tracking service (e.g., Sentry)
	// Example: Sentry.captureException(error, { extra: context })
}

interface ErrorResponse {
	data?: {
		message?: string
		code?: string
		userMessage?: string
	}
	status?: number
	statusText?: string
	message?: string
	config?: {
		url?: string
		method?: string
	}
}

export const createErrorFromResponse = (
	response: ErrorResponse,
	defaultMessage = "Request failed",
): ApplicationError => {
	const message = response?.data?.message ?? response?.message ?? defaultMessage
	const code = response?.data?.code ?? response?.status?.toString()

	return new ApplicationError(message, {
		code,
		severity: response?.status && response.status >= 500 ? "high" : "medium",
		context: {
			status: response?.status,
			statusText: response?.statusText,
			url: response?.config?.url,
			method: response?.config?.method,
		},
		userMessage: response?.data?.userMessage ?? message,
	})
}
