import { useSetAtom } from "jotai"
import { useCallback } from "react"

import { type DrawerOptions, closeDrawerAtom, openDrawerAtom } from "@/stores/drawer.store"

const useAppDrawer = () => {
	const open = useSetAtom(openDrawerAtom)
	const close = useSetAtom(closeDrawerAtom)

	const openDrawer = useCallback(
		(options: DrawerOptions) => {
			open(options)
		},
		[open],
	)

	const closeDrawer = useCallback(() => {
		close()
	}, [close])

	return { openDrawer, closeDrawer }
}

export type { DrawerOptions } from "@/stores/drawer.store"
export default useAppDrawer
