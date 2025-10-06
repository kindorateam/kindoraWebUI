import { atom } from "jotai"

import { appStore } from "./jotaiStore"

interface AddRoomDrawerState {
	isOpen: boolean
}

const initialState: AddRoomDrawerState = {
	isOpen: false,
}

export const addRoomDrawerStateAtom = atom<AddRoomDrawerState>(initialState)

export const addRoomDrawerIsOpenAtom = atom((get) => get(addRoomDrawerStateAtom).isOpen)

export const openAddRoomDrawerAtom = atom(null, (_get, set) => {
	set(addRoomDrawerStateAtom, {
		isOpen: true,
	})
})

export const closeAddRoomDrawerAtom = atom(null, (_get, set) => {
	set(addRoomDrawerStateAtom, {
		isOpen: false,
	})
})

export const openAddRoomDrawer = () => {
	appStore.set(openAddRoomDrawerAtom)
}

export const closeAddRoomDrawer = () => {
	appStore.set(closeAddRoomDrawerAtom)
}
