import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const navDrawerExpandedItemsAtom = atomWithStorage<string[]>("navdrawer-expanded-items", [])

const addUnique = (items: string[], item: string) => (items.includes(item) ? items : [...items, item])
const removeItem = (items: string[], item: string) => items.filter((currentItem) => currentItem !== item)

export const toggleNavDrawerItemAtom = atom(null, (get, set, itemKey: string) => {
	const currentExpanded = get(navDrawerExpandedItemsAtom)

	set(
		navDrawerExpandedItemsAtom,
		currentExpanded.includes(itemKey) ? removeItem(currentExpanded, itemKey) : addUnique(currentExpanded, itemKey),
	)
})

export const isNavDrawerItemExpandedAtom = atom((get) => (itemKey: string) => {
	const expandedItems = get(navDrawerExpandedItemsAtom)
	return expandedItems.includes(itemKey)
})
