import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, resources } from "./resources"

void i18n.use(initReactI18next).init({
	fallbackLng: DEFAULT_LOCALE,
	interpolation: {
		escapeValue: false,
	},
	lng: DEFAULT_LOCALE,
	resources,
	returnNull: false,
	supportedLngs: SUPPORTED_LOCALES,
})

export default i18n
