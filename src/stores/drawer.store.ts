import { atom } from "jotai"

import { appStore } from "./jotaiStore"

import type { DrawerProps } from "@heroui/react"

type DrawerPlacement = NonNullable<DrawerProps["placement"]>
type DrawerSize = NonNullable<DrawerProps["size"]>

interface DrawerOptions {
	title?: string
	initialTabKey?: string
	placement?: DrawerPlacement
	size?: DrawerSize
}

interface DrawerState {
	isOpen: boolean
	options: DrawerOptions | null
}

const initialState: DrawerState = {
	isOpen: false,
	options: null,
}

export const drawerStateAtom = atom<DrawerState>(initialState)

export const drawerIsOpenAtom = atom((get) => get(drawerStateAtom).isOpen)

export const drawerOptionsAtom = atom((get) => get(drawerStateAtom).options)

export const openDrawerAtom = atom(null, (_get, set, options: DrawerOptions) => {
	set(drawerStateAtom, {
		isOpen: true,
		options,
	})
})

export const closeDrawerAtom = atom(null, (_get, set) => {
	set(drawerStateAtom, (prev) => ({
		isOpen: false,
		options: prev.options,
	}))
})

export const resetDrawerAtom = atom(null, (_get, set) => {
	set(drawerStateAtom, initialState)
})

export const openDrawer = (options: DrawerOptions) => {
	appStore.set(openDrawerAtom, options)
}

export const closeDrawer = () => {
	appStore.set(closeDrawerAtom)
}

export const resetDrawer = () => {
	appStore.set(resetDrawerAtom)
}

export type { DrawerOptions }
