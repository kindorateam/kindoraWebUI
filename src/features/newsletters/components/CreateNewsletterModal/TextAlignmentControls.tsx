import { ToggleButtonGroup } from "@heroui/react"
import { useEffect, useRef } from "react"

import TablerAlignCenter from "~icons/tabler/align-center"
import TablerAlignLeft from "~icons/tabler/align-left"
import TablerAlignRight from "~icons/tabler/align-right"

import ToolbarToggleButton from "./ToolbarToggleButton"
import { useEditorToolbarValue } from "./use-editor-toolbar-value"

import type { Editor } from "@tiptap/react"

const ALIGNMENTS = ["left", "center", "right"] as const
type Alignment = (typeof ALIGNMENTS)[number]
type ToolbarSelectionKey = string | number

interface TextAlignmentControlsProps {
	editor: Editor
}

const getImageAlignment = (editor: Editor): Alignment => {
	const align = editor.getAttributes("image").align
	return typeof align === "string" && ALIGNMENTS.includes(align as Alignment) ? (align as Alignment) : "left"
}

const getSelectedImagePosition = (editor: Editor) => {
	const { selection } = editor.state
	const maybeNodeSelection = selection as typeof selection & { node?: { type: { name: string } } }

	return maybeNodeSelection.node?.type.name === "image" ? selection.from : null
}

const getActiveAlignment = (editor: Editor): Alignment => {
	if (getSelectedImagePosition(editor) !== null) return getImageAlignment(editor)
	return ALIGNMENTS.find((alignment) => editor.isActive({ textAlign: alignment })) ?? "left"
}

const getSelectedAlignment = (editor: Editor) => new Set<ToolbarSelectionKey>([getActiveAlignment(editor)])

const isAlignment = (value: ToolbarSelectionKey): value is Alignment =>
	typeof value === "string" && ALIGNMENTS.includes(value as Alignment)

const TextAlignmentControls = ({ editor }: TextAlignmentControlsProps) => {
	const [selectedAlignment, setSelectedAlignment] = useEditorToolbarValue(editor, getSelectedAlignment)
	const selectedImagePositionRef = useRef<number | null>(getSelectedImagePosition(editor))

	useEffect(() => {
		const syncSelectedImagePosition = () => {
			selectedImagePositionRef.current = getSelectedImagePosition(editor)
		}

		syncSelectedImagePosition()
		editor.on("transaction", syncSelectedImagePosition)
		editor.on("selectionUpdate", syncSelectedImagePosition)

		return () => {
			editor.off("transaction", syncSelectedImagePosition)
			editor.off("selectionUpdate", syncSelectedImagePosition)
		}
	}, [editor])

	const applyAlignment = (alignment: Alignment) => {
		const selectedImagePosition = getSelectedImagePosition(editor) ?? selectedImagePositionRef.current
		if (selectedImagePosition !== null) {
			editor
				.chain()
				.focus()
				.setNodeSelection(selectedImagePosition)
				.updateAttributes("image", { align: alignment })
				.run()
			setSelectedAlignment(new Set<ToolbarSelectionKey>([alignment]))
			return
		}

		if (editor.chain().focus().setTextAlign(alignment).run()) {
			setSelectedAlignment(new Set<ToolbarSelectionKey>([alignment]))
		}
	}

	const handleSelectionChange = (keys: Set<ToolbarSelectionKey>) => {
		const [alignment] = keys
		if (!alignment || !isAlignment(alignment)) return

		applyAlignment(alignment)
	}

	return (
		<ToggleButtonGroup
			aria-label="Text alignment"
			className="flex gap-1"
			disallowEmptySelection
			isDetached
			onSelectionChange={handleSelectionChange}
			selectedKeys={selectedAlignment}
			selectionMode="single"
			size="sm"
		>
			<ToolbarToggleButton
				icon={<TablerAlignLeft className="size-4" />}
				id="left"
				onPress={() => applyAlignment("left")}
				tooltip="Align left"
			/>
			<ToolbarToggleButton
				icon={<TablerAlignCenter className="size-4" />}
				id="center"
				onPress={() => applyAlignment("center")}
				tooltip="Align center"
			/>
			<ToolbarToggleButton
				icon={<TablerAlignRight className="size-4" />}
				id="right"
				onPress={() => applyAlignment("right")}
				tooltip="Align right"
			/>
		</ToggleButtonGroup>
	)
}

export default TextAlignmentControls
