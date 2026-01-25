import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

interface TransferStudentModalState {
	isOpen: boolean
	sourceRoomId: string | null
	studentIds: string[]
}

const initialState: TransferStudentModalState = {
	isOpen: false,
	sourceRoomId: null,
	studentIds: [],
}

export const transferStudentModalAtom = atom<TransferStudentModalState>(initialState)

export const openTransferStudentModal = (sourceRoomId: string, studentIds: string[]) => {
	appStore.set(transferStudentModalAtom, {
		isOpen: true,
		sourceRoomId,
		studentIds,
	})
}

export const closeTransferStudentModal = () => {
	appStore.set(transferStudentModalAtom, initialState)
}
