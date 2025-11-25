import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const isAddRoomModalOpenAtom = atom(false)

export const openAddRoomModal = () => {
	appStore.set(isAddRoomModalOpenAtom, true)
}

export const closeAddRoomModal = () => {
	appStore.set(isAddRoomModalOpenAtom, false)
}
