import { useSetAtom } from "jotai"

import { type DrawerOptions, closeDrawerAtom, openDrawerAtom } from "@/stores/drawer.store"

const useAppDrawer = () => {
	const open = useSetAtom(openDrawerAtom)
	const close = useSetAtom(closeDrawerAtom)

	const openDrawer = (options: DrawerOptions) => {
		open(options)
	}

	const closeDrawer = () => {
		close()
	}

	return { openDrawer, closeDrawer }
}

export type { DrawerOptions } from "@/stores/drawer.store"
export default useAppDrawer
