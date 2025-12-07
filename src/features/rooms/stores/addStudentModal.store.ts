import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const isAddStudentModalOpenAtom = atom(false)

export const openAddStudentModal = () => {
	appStore.set(isAddStudentModalOpenAtom, true)
}

export const closeAddStudentModal = () => {
	appStore.set(isAddStudentModalOpenAtom, false)
}
