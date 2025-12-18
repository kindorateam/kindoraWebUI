import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

interface DeactivateRoomModalState {
	isOpen: boolean
	roomId: string | null
	roomName: string | null
}

export const deactivateRoomModalAtom = atom<DeactivateRoomModalState>({
	isOpen: false,
	roomId: null,
	roomName: null,
})

export const openDeactivateRoomModal = (roomId: string, roomName: string) => {
	appStore.set(deactivateRoomModalAtom, {
		isOpen: true,
		roomId,
		roomName,
	})
}

export const closeDeactivateRoomModal = () => {
	appStore.set(deactivateRoomModalAtom, {
		isOpen: false,
		roomId: null,
		roomName: null,
	})
}
