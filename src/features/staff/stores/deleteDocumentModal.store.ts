import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const deleteDocumentIdAtom = atom<string | null>(null)

export const openDeleteDocumentModal = (documentId: string) => {
	appStore.set(deleteDocumentIdAtom, documentId)
}

export const closeDeleteDocumentModal = () => {
	appStore.set(deleteDocumentIdAtom, null)
}
