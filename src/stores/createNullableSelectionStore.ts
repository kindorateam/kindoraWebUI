import { atom } from "jotai"

import { appStore } from "@/stores/jotaiStore"

export const createNullableSelectionStore = <T>() => {
	const valueAtom = atom<T | null>(null)

	return {
		clear: () => appStore.set(valueAtom, null),
		select: (value: T) => appStore.set(valueAtom, value),
		valueAtom,
	}
}
