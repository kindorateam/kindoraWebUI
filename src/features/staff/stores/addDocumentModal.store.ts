import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const isAddDocumentModalOpenAtom = atom(false)

export const openAddDocumentModal = () => {
	appStore.set(isAddDocumentModalOpenAtom, true)
}

export const closeAddDocumentModal = () => {
	appStore.set(isAddDocumentModalOpenAtom, false)
}
