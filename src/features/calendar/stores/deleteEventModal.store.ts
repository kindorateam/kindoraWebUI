import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

interface DeleteEventModalState {
	isOpen: boolean
	eventId: string | null
	eventTitle: string | null
}

export const deleteEventModalAtom = atom<DeleteEventModalState>({
	isOpen: false,
	eventId: null,
	eventTitle: null,
})

export const openDeleteEventModal = (eventId: string, eventTitle: string) => {
	appStore.set(deleteEventModalAtom, {
		isOpen: true,
		eventId,
		eventTitle,
	})
}

export const closeDeleteEventModal = () => {
	appStore.set(deleteEventModalAtom, {
		isOpen: false,
		eventId: null,
		eventTitle: null,
	})
}
