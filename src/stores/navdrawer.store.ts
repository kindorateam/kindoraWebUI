import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const navDrawerExpandedItemsAtom = atomWithStorage<string[]>("navdrawer-expanded-items", [])

export const toggleNavDrawerItemAtom = atom(null, (get, set, itemLabel: string) => {
	const currentExpanded = get(navDrawerExpandedItemsAtom)
	const isCurrentlyExpanded = currentExpanded.includes(itemLabel)

	if (isCurrentlyExpanded) {
		set(
			navDrawerExpandedItemsAtom,
			currentExpanded.filter((item) => item !== itemLabel),
		)
	} else {
		set(navDrawerExpandedItemsAtom, [...currentExpanded, itemLabel])
	}
})

export const isNavDrawerItemExpandedAtom = atom((get) => (itemLabel: string) => {
	const expandedItems = get(navDrawerExpandedItemsAtom)
	return expandedItems.includes(itemLabel)
})
