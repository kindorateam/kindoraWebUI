import { createModalStore } from "@/stores/createModalStore"

export const {
	close: closeRegeneratePinModal,
	isOpenAtom: isRegeneratePinModalOpenAtom,
	open: openRegeneratePinModal,
} = createModalStore()
