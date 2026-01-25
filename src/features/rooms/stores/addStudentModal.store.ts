import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

interface AddStudentModalState {
	isOpen: boolean
	roomId: string | null
}

const initialState: AddStudentModalState = {
	isOpen: false,
	roomId: null,
}

export const addStudentModalAtom = atom<AddStudentModalState>(initialState)

export const openAddStudentModal = (roomId: string) => {
	appStore.set(addStudentModalAtom, {
		isOpen: true,
		roomId,
	})
}

export const closeAddStudentModal = () => {
	appStore.set(addStudentModalAtom, initialState)
}
