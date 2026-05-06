import en from "./locales/en"

export const DEFAULT_LOCALE = "en"

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE] as const

export const resources = {
	en: {
		translation: en,
	},
} as const
