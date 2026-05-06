import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const navDrawerExpandedItemsAtom = atomWithStorage<string[]>("navdrawer-expanded-items", [])

export const toggleNavDrawerItemAtom = atom(null, (get, set, itemKey: string) => {
	const currentExpanded = get(navDrawerExpandedItemsAtom)
	const isCurrentlyExpanded = currentExpanded.includes(itemKey)

	if (isCurrentlyExpanded) {
		set(
			navDrawerExpandedItemsAtom,
			currentExpanded.filter((item) => item !== itemKey),
		)
	} else {
		set(navDrawerExpandedItemsAtom, [...currentExpanded, itemKey])
	}
})

export const isNavDrawerItemExpandedAtom = atom((get) => (itemKey: string) => {
	const expandedItems = get(navDrawerExpandedItemsAtom)
	return expandedItems.includes(itemKey)
})
