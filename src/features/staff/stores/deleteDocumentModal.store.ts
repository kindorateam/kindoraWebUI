import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const deleteDocumentIdAtom = atom<number | null>(null)

export const openDeleteDocumentModal = (documentId: number) => {
	appStore.set(deleteDocumentIdAtom, documentId)
}

export const closeDeleteDocumentModal = () => {
	appStore.set(deleteDocumentIdAtom, null)
}
