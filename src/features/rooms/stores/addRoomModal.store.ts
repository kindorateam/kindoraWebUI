import { createModalStore } from "@/stores/createModalStore"

export const {
	close: closeAddRoomModal,
	isOpenAtom: isAddRoomModalOpenAtom,
	open: openAddRoomModal,
} = createModalStore()
