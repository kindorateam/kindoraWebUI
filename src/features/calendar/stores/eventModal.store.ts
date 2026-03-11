import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

import type { CalendarEvent } from "../types"

interface EventModalState {
	isOpen: boolean
	event: CalendarEvent | null
	defaultStart: string | null
	defaultEnd: string | null
	defaultAllDay: boolean
}

export const eventModalAtom = atom<EventModalState>({
	isOpen: false,
	event: null,
	defaultStart: null,
	defaultEnd: null,
	defaultAllDay: false,
})

export const openCreateEventModal = (options?: { start?: string; end?: string; allDay?: boolean }) => {
	appStore.set(eventModalAtom, {
		isOpen: true,
		event: null,
		defaultStart: options?.start ?? null,
		defaultEnd: options?.end ?? null,
		defaultAllDay: options?.allDay ?? false,
	})
}

export const openEditEventModal = (event: CalendarEvent) => {
	appStore.set(eventModalAtom, {
		isOpen: true,
		event,
		defaultStart: null,
		defaultEnd: null,
		defaultAllDay: false,
	})
}

export const closeEventModal = () => {
	appStore.set(eventModalAtom, {
		isOpen: false,
		event: null,
		defaultStart: null,
		defaultEnd: null,
		defaultAllDay: false,
	})
}
