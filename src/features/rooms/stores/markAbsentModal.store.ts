import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

interface MarkAbsentModalState {
	isOpen: boolean
	studentId: string | null
	studentName: string | null
}

const initialState: MarkAbsentModalState = {
	isOpen: false,
	studentId: null,
	studentName: null,
}

export const markAbsentModalAtom = atom<MarkAbsentModalState>(initialState)

export const openMarkAbsentModal = (studentId: string, studentName: string) => {
	appStore.set(markAbsentModalAtom, {
		isOpen: true,
		studentId,
		studentName,
	})
}

export const closeMarkAbsentModal = () => {
	appStore.set(markAbsentModalAtom, initialState)
}
