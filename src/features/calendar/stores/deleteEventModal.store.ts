import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

interface DeleteEventModalState {
	isOpen: boolean
	eventId: string | null
	eventTitle: string | null
	eventStart: string | null
	isRepeating: boolean
}

export const deleteEventModalAtom = atom<DeleteEventModalState>({
	isOpen: false,
	eventId: null,
	eventTitle: null,
	eventStart: null,
	isRepeating: false,
})

export const openDeleteEventModal = (eventId: string, eventTitle: string, eventStart: string, isRepeating: boolean) => {
	appStore.set(deleteEventModalAtom, {
		isOpen: true,
		eventId,
		eventTitle,
		eventStart,
		isRepeating,
	})
}

export const closeDeleteEventModal = () => {
	appStore.set(deleteEventModalAtom, {
		isOpen: false,
		eventId: null,
		eventTitle: null,
		eventStart: null,
		isRepeating: false,
	})
}
