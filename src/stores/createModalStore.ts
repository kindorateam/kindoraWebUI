import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const createModalStore = () => {
	const isOpenAtom = atom(false)

	return {
		close: () => appStore.set(isOpenAtom, false),
		isOpenAtom,
		open: () => appStore.set(isOpenAtom, true),
	}
}
