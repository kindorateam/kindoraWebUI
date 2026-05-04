import { useEffect, useState } from "react"

import type { Editor } from "@tiptap/react"

export const useEditorToolbarValue = <Value>(editor: Editor, getValue: (editor: Editor) => Value) => {
	const [value, setValue] = useState(() => getValue(editor))

	useEffect(() => {
		let frame: number | null = null

		const syncValue = () => setValue(getValue(editor))
		const syncValueAfterDomUpdate = () => {
			if (frame !== null) {
				window.cancelAnimationFrame(frame)
			}

			frame = window.requestAnimationFrame(() => {
				frame = null
				syncValue()
			})
		}

		syncValue()
		editor.on("transaction", syncValue)
		editor.on("selectionUpdate", syncValue)
		editor.on("focus", syncValue)
		editor.view.dom.addEventListener("click", syncValueAfterDomUpdate)
		editor.view.dom.addEventListener("mouseup", syncValueAfterDomUpdate)
		document.addEventListener("selectionchange", syncValueAfterDomUpdate)

		return () => {
			if (frame !== null) {
				window.cancelAnimationFrame(frame)
			}

			editor.off("transaction", syncValue)
			editor.off("selectionUpdate", syncValue)
			editor.off("focus", syncValue)
			editor.view.dom.removeEventListener("click", syncValueAfterDomUpdate)
			editor.view.dom.removeEventListener("mouseup", syncValueAfterDomUpdate)
			document.removeEventListener("selectionchange", syncValueAfterDomUpdate)
		}
	}, [editor, getValue])

	return [value, setValue] as const
}
