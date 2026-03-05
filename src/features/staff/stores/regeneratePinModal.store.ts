import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const isRegeneratePinModalOpenAtom = atom(false)

export const openRegeneratePinModal = () => {
	appStore.set(isRegeneratePinModalOpenAtom, true)
}

export const closeRegeneratePinModal = () => {
	appStore.set(isRegeneratePinModalOpenAtom, false)
}
