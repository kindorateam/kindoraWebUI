import { useAtom } from "jotai"
import { useEffect } from "react"

import i18n from "./index"
import { localeAtom } from "./locale.store"
import { LANGUAGE_OPTIONS } from "./resources"

import type { SupportedLocale } from "./resources"

export const useLanguage = () => {
	const [locale, setLocale] = useAtom(localeAtom)

	useEffect(() => {
		if (i18n.language !== locale) {
			void i18n.changeLanguage(locale)
		}
	}, [locale])

	const changeLanguage = (nextLocale: SupportedLocale) => {
		setLocale(nextLocale)
	}

	return {
		changeLanguage,
		languageOptions: LANGUAGE_OPTIONS,
		locale,
	}
}
