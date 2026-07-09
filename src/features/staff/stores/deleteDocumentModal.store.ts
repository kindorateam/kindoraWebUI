import { createNullableSelectionStore } from "@/stores/createNullableSelectionStore"

const deleteDocumentStore = createNullableSelectionStore<number>()

export const deleteDocumentIdAtom = deleteDocumentStore.valueAtom
export const openDeleteDocumentModal = deleteDocumentStore.select
export const closeDeleteDocumentModal = deleteDocumentStore.clear
