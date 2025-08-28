import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// NavDrawer expanded state - persists across sessions
export const navDrawerExpandedItemsAtom = atomWithStorage<string[]>(
  'navdrawer-expanded-items',
  [],
)

// Action atom for toggling expanded state
export const toggleNavDrawerItemAtom = atom(
  null,
  (get, set, itemLabel: string) => {
    const currentExpanded = get(navDrawerExpandedItemsAtom)
    const isCurrentlyExpanded = currentExpanded.includes(itemLabel)

    if (isCurrentlyExpanded) {
      // Remove from expanded items (collapse)
      set(
        navDrawerExpandedItemsAtom,
        currentExpanded.filter((item) => item !== itemLabel),
      )
    } else {
      // Add to expanded items (expand)
      set(navDrawerExpandedItemsAtom, [...currentExpanded, itemLabel])
    }
  },
)

// Derived atom for checking if an item is expanded
export const isNavDrawerItemExpandedAtom = atom(
  (get) => (itemLabel: string) => {
    const expandedItems = get(navDrawerExpandedItemsAtom)
    return expandedItems.includes(itemLabel)
  },
)
