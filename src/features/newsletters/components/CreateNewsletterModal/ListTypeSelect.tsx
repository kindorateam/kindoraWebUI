import { ListBox, Select } from "@heroui/react"

import { useEditorToolbarValue } from "./use-editor-toolbar-value"

import type { Editor } from "@tiptap/react"
import type React from "react"

interface ListTypeSelectProps {
	editor: Editor
}

type ListTypeValue = "none" | "bullet" | "ordered" | "task"

const LIST_OPTIONS = [
	{ key: "none", label: "No list" },
	{ key: "bullet", label: "Bullet list" },
	{ key: "ordered", label: "Ordered list" },
	{ key: "task", label: "Task list" },
] satisfies { key: ListTypeValue; label: string }[]

const getEditorStateListType = (editor: Editor): ListTypeValue => {
	const { $from } = editor.state.selection

	for (let depth = $from.depth; depth >= 0; depth -= 1) {
		const nodeName = $from.node(depth).type.name

		if (nodeName === "taskList") return "task"
		if (nodeName === "bulletList") return "bullet"
		if (nodeName === "orderedList") return "ordered"
	}

	return "none"
}

const getDomListType = (editor: Editor): ListTypeValue => {
	const selection = window.getSelection()
	const anchorNode = selection?.anchorNode

	if (!anchorNode || !editor.view.dom.contains(anchorNode)) return "none"

	const element = anchorNode.nodeType === window.Node.ELEMENT_NODE ? (anchorNode as Element) : anchorNode.parentElement
	const listElement = element?.closest('ul[data-type="taskList"], li[data-type="taskItem"], ul, ol')

	if (!listElement || !editor.view.dom.contains(listElement)) return "none"
	if (listElement.matches('ul[data-type="taskList"], li[data-type="taskItem"]')) return "task"
	if (listElement.matches("ul")) return "bullet"
	if (listElement.matches("ol")) return "ordered"

	return "none"
}

const getListType = (editor: Editor): ListTypeValue => {
	const stateValue = getEditorStateListType(editor)
	return stateValue === "none" ? getDomListType(editor) : stateValue
}

const isListTypeValue = (value: string): value is ListTypeValue => LIST_OPTIONS.some((option) => option.key === value)

const ListTypeSelect = ({ editor }: ListTypeSelectProps) => {
	const [listSelectValue, setListSelectValue] = useEditorToolbarValue(editor, getListType)

	const clearActiveList = () => {
		if (editor.isActive("bulletList")) {
			editor.chain().focus().toggleBulletList().run()
		}
		if (editor.isActive("orderedList")) {
			editor.chain().focus().toggleOrderedList().run()
		}
		if (editor.isActive("taskList")) {
			editor.chain().focus().toggleTaskList().run()
		}
	}

	const handleListChange = (key: React.Key | null) => {
		if (key === null) return

		const value = String(key)
		if (!isListTypeValue(value)) return

		if (value === "none") {
			clearActiveList()
			setListSelectValue("none")
			return
		}

		if (listSelectValue !== "none") {
			clearActiveList()
		}

		if (value === "bullet") {
			editor.chain().focus().toggleBulletList().run()
			setListSelectValue("bullet")
			return
		}

		if (value === "ordered") {
			editor.chain().focus().toggleOrderedList().run()
			setListSelectValue("ordered")
			return
		}

		if (value === "task") {
			editor.chain().focus().toggleTaskList().run()
			setListSelectValue("task")
		}
	}

	return (
		<Select
			aria-label="List type"
			className="w-32"
			onSelectionChange={handleListChange}
			selectedKey={listSelectValue}
			variant="secondary"
		>
			<Select.Trigger className="h-8! min-h-8! items-center px-2! py-0! text-xs">
				<Select.Value className="flex items-center text-default-700 text-xs leading-none" />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{LIST_OPTIONS.map((option) => (
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

export default ListTypeSelect
