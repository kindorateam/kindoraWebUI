import en from "./locales/en"
import es from "./locales/es"

export const DEFAULT_LOCALE = "en"

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, "es"] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const LANGUAGE_OPTIONS: Array<{
	locale: SupportedLocale
	labelKey: "language.english" | "language.spanish"
	shortLabel: string
}> = [
	{
		locale: "en",
		labelKey: "language.english",
		shortLabel: "EN",
	},
	{
		locale: "es",
		labelKey: "language.spanish",
		shortLabel: "ES",
	},
]

export const resources = {
	en: {
		translation: en,
	},
	es: {
		translation: es,
	},
} as const
