import { createModalStore } from "@/stores/createModalStore"

export const {
	close: closeAddDocumentModal,
	isOpenAtom: isAddDocumentModalOpenAtom,
	open: openAddDocumentModal,
} = createModalStore()
