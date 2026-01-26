import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const isAddStaffModalOpenAtom = atom(false)

export const openAddStaffModal = () => {
	appStore.set(isAddStaffModalOpenAtom, true)
}

export const closeAddStaffModal = () => {
	appStore.set(isAddStaffModalOpenAtom, false)
}
