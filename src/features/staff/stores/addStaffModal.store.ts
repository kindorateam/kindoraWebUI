import { createModalStore } from "@/stores/createModalStore"

export const {
	close: closeAddStaffModal,
	isOpenAtom: isAddStaffModalOpenAtom,
	open: openAddStaffModal,
} = createModalStore()
