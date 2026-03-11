import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { appStore } from "@/stores/jotaiStore"

import type { CalendarViewType } from "../types"

export const hideWeekendsAtom = atomWithStorage<boolean>("calendar-hide-weekends", false)

export const calendarViewAtom = atomWithStorage<CalendarViewType>("calendar-view", "timeGridWeek")

export const dateRangeAtom = atom<{ start: string; end: string }>({
	start: "",
	end: "",
})

export const setDateRange = (start: string, end: string) => {
	appStore.set(dateRangeAtom, { start, end })
}
