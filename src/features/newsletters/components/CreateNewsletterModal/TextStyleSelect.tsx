import { ListBox, Select } from "@heroui/react"

import { useEditorToolbarValue } from "./use-editor-toolbar-value"

import type { Editor } from "@tiptap/react"
import type React from "react"

const HEADING_LEVELS = [1, 2, 3, 4] as const
type HeadingLevel = (typeof HEADING_LEVELS)[number]
type TextStyleValue = "paragraph" | `h${HeadingLevel}` | ""

const TEXT_STYLE_OPTIONS: { key: Exclude<TextStyleValue, "">; label: string }[] = [
	{ key: "h1", label: "Heading 1" },
	{ key: "h2", label: "Heading 2" },
	{ key: "h3", label: "Heading 3" },
	{ key: "h4", label: "Heading 4" },
	{ key: "paragraph", label: "Paragraph" },
]

interface TextStyleSelectProps {
	editor: Editor
}

const parseHeadingLevel = (value: string): HeadingLevel | null => {
	const parsed = Number.parseInt(value.replace("h", ""), 10)
	if (Number.isNaN(parsed)) return null
	return HEADING_LEVELS.includes(parsed as HeadingLevel) ? (parsed as HeadingLevel) : null
}

const getEditorStateTextStyleValue = (editor: Editor): TextStyleValue => {
	const { $from } = editor.state.selection

	for (let depth = $from.depth; depth >= 0; depth -= 1) {
		const node = $from.node(depth)

		if (node.type.name === "heading") {
			const level = Number(node.attrs.level)
			return HEADING_LEVELS.includes(level as HeadingLevel) ? `h${level as HeadingLevel}` : ""
		}

		if (node.type.name === "paragraph") {
			return "paragraph"
		}
	}

	return ""
}

const getElementTextStyleValue = (element: Element | null, root: Element): TextStyleValue => {
	let currentElement = element

	while (currentElement && currentElement !== root) {
		const tagName = currentElement.tagName.toLowerCase()

		if (tagName === "p") return "paragraph"
		if (/^h[1-4]$/.test(tagName)) return tagName as TextStyleValue

		currentElement = currentElement.parentElement
	}

	return ""
}

const getDomTextStyleValue = (editor: Editor): TextStyleValue => {
	const selection = window.getSelection()
	const anchorNode = selection?.anchorNode

	if (!anchorNode || !editor.view.dom.contains(anchorNode)) return ""

	const element = anchorNode.nodeType === window.Node.ELEMENT_NODE ? (anchorNode as Element) : anchorNode.parentElement

	return getElementTextStyleValue(element, editor.view.dom)
}

const getTextStyleValue = (editor: Editor): TextStyleValue => {
	const domValue = getDomTextStyleValue(editor)
	return domValue || getEditorStateTextStyleValue(editor)
}

const TextStyleSelect = ({ editor }: TextStyleSelectProps) => {
	const [textStyleValue, setTextStyleValue] = useEditorToolbarValue(editor, getTextStyleValue)

	const handleHeadingChange = (key: React.Key | null) => {
		if (key === null) return

		const value = String(key)
		if (value === "paragraph") {
			editor.chain().focus().setParagraph().run()
			setTextStyleValue("paragraph")
			return
		}

		const level = parseHeadingLevel(value)
		if (level) {
			editor.chain().focus().setHeading({ level }).run()
			setTextStyleValue(`h${level}`)
		}
	}

	return (
		<Select
			aria-label="Text style"
			className="w-32"
			onSelectionChange={handleHeadingChange}
			placeholder="Style"
			selectedKey={textStyleValue || null}
			variant="secondary"
		>
			<Select.Trigger className="h-8! min-h-8! items-center px-2! py-0! text-xs">
				<Select.Value className="flex items-center text-default-700 text-xs leading-none" />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{TEXT_STYLE_OPTIONS.map((option) => (
						<ListBox.Item id={option.key} key={option.key} textValue={option.label}>
							{option.label}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}

export default TextStyleSelect
