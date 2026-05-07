import { atomWithStorage } from "jotai/utils"

import { DEFAULT_LOCALE } from "./resources"

import type { SupportedLocale } from "./resources"

export const localeAtom = atomWithStorage<SupportedLocale>("kindora-locale", DEFAULT_LOCALE)
