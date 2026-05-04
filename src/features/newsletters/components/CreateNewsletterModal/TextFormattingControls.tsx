import { ToggleButtonGroup } from "@heroui/react"

import TablerBold from "~icons/tabler/bold"
import TablerItalic from "~icons/tabler/italic"
import TablerStrikethrough from "~icons/tabler/strikethrough"
import TablerUnderline from "~icons/tabler/underline"

import ToolbarToggleButton from "./ToolbarToggleButton"
import { useEditorToolbarValue } from "./use-editor-toolbar-value"

import type { Editor } from "@tiptap/react"

const FORMAT_MARKS = ["bold", "italic", "underline", "strike"] as const
type FormatMark = (typeof FORMAT_MARKS)[number]
type ToolbarSelectionKey = string | number

interface TextFormattingControlsProps {
	editor: Editor
}

const toggleFormatMark = (editor: Editor, mark: FormatMark) => {
	if (mark === "bold") {
		editor.chain().focus().toggleBold().run()
		return
	}

	if (mark === "italic") {
		editor.chain().focus().toggleItalic().run()
		return
	}

	if (mark === "underline") {
		editor.chain().focus().toggleUnderline().run()
		return
	}

	editor.chain().focus().toggleStrike().run()
}

const getSelectedFormatMarks = (editor: Editor) =>
	new Set<ToolbarSelectionKey>(FORMAT_MARKS.filter((mark) => editor.isActive(mark)))

const TextFormattingControls = ({ editor }: TextFormattingControlsProps) => {
	const [selectedFormatMarks, setSelectedFormatMarks] = useEditorToolbarValue(editor, getSelectedFormatMarks)

	const handleSelectionChange = (keys: Set<ToolbarSelectionKey>) => {
		for (const mark of FORMAT_MARKS) {
			if (keys.has(mark) !== selectedFormatMarks.has(mark)) {
				toggleFormatMark(editor, mark)
			}
		}

		setSelectedFormatMarks(new Set(keys))
	}

	return (
		<ToggleButtonGroup
			aria-label="Text formatting"
			className="flex gap-1"
			isDetached
			onSelectionChange={handleSelectionChange}
			selectedKeys={selectedFormatMarks}
			selectionMode="multiple"
			size="sm"
		>
			<ToolbarToggleButton icon={<TablerBold className="size-4" />} id="bold" tooltip="Bold" />
			<ToolbarToggleButton icon={<TablerItalic className="size-4" />} id="italic" tooltip="Italic" />
			<ToolbarToggleButton icon={<TablerUnderline className="size-4" />} id="underline" tooltip="Underline" />
			<ToolbarToggleButton icon={<TablerStrikethrough className="size-4" />} id="strike" tooltip="Strikethrough" />
		</ToggleButtonGroup>
	)
}

export default TextFormattingControls
