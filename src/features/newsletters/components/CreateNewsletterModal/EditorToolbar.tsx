import { Button, Input, Popover, Tooltip } from "@heroui/react"
import { useEffect, useRef, useState } from "react"

import TablerAlignCenter from "~icons/tabler/align-center"
import TablerAlignLeft from "~icons/tabler/align-left"
import TablerAlignRight from "~icons/tabler/align-right"
import TablerArrowBackUp from "~icons/tabler/arrow-back-up"
import TablerArrowForwardUp from "~icons/tabler/arrow-forward-up"
import TablerBlockquote from "~icons/tabler/blockquote"
import TablerBold from "~icons/tabler/bold"
import TablerClearFormatting from "~icons/tabler/clear-formatting"
import TablerCloudUpload from "~icons/tabler/cloud-upload"
import TablerItalic from "~icons/tabler/italic"
import TablerLayoutNavbar from "~icons/tabler/layout-navbar"
import TablerLayoutNavbarExpand from "~icons/tabler/layout-navbar-expand"
import TablerLine from "~icons/tabler/line"
import TablerPhoto from "~icons/tabler/photo"
import TablerStrikethrough from "~icons/tabler/strikethrough"
import TablerUnderline from "~icons/tabler/underline"

import LinkPopover from "./LinkPopover"

import type { Editor } from "@tiptap/react"
import type React from "react"

interface ToolbarButtonProps {
	icon: React.ReactNode
	tooltip: string
	onPress: () => void
	isActive?: boolean
	isDisabled?: boolean
}

const ToolbarButton = ({ icon, tooltip, onPress, isActive = false, isDisabled = false }: ToolbarButtonProps) => (
	<Tooltip delay={0}>
		<Button isIconOnly isDisabled={isDisabled} onPress={onPress} size="sm" variant={isActive ? "secondary" : "ghost"}>
			{icon}
		</Button>
		<Tooltip.Content>{tooltip}</Tooltip.Content>
	</Tooltip>
)

const HEADING_LEVELS = [1, 2, 3, 4] as const
type HeadingLevel = (typeof HEADING_LEVELS)[number]

const parseHeadingLevel = (value: string): HeadingLevel | null => {
	const parsed = Number.parseInt(value.replace("h", ""), 10)
	if (Number.isNaN(parsed)) return null
	return HEADING_LEVELS.includes(parsed as HeadingLevel) ? (parsed as HeadingLevel) : null
}

interface EditorToolbarProps {
	editor: Editor
}

const ToolbarDivider = () => <div className="mx-1 w-px bg-default-200" />

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
	const [imageUrl, setImageUrl] = useState("")
	const [isImageOpen, setIsImageOpen] = useState(false)
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [listSelectValue, setListSelectValue] = useState("")
	const suppressListSyncRef = useRef(false)

	const listValue = editor.isActive("taskList")
		? "task"
		: editor.isActive("bulletList")
			? "bullet"
			: editor.isActive("orderedList")
				? "ordered"
				: "none"

	const headingValue = editor.isActive("heading", { level: 1 })
		? "h1"
		: editor.isActive("heading", { level: 2 })
			? "h2"
			: editor.isActive("heading", { level: 3 })
				? "h3"
				: editor.isActive("heading", { level: 4 })
					? "h4"
					: ""

	const addImage = () => {
		if (!imageUrl) return

		editor.chain().focus().setImage({ src: imageUrl }).run()
		setImageUrl("")
		setIsImageOpen(false)
	}

	const handleHeadingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value
		if (value === "paragraph") {
			editor.chain().focus().setParagraph().run()
			return
		}

		const level = parseHeadingLevel(value)
		if (level) {
			editor.chain().focus().setHeading({ level }).run()
		}
	}

	const handleListChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value
		suppressListSyncRef.current = false

		if (value === listValue) {
			if (editor.isActive("bulletList")) {
				editor.chain().focus().toggleBulletList().run()
			}
			if (editor.isActive("orderedList")) {
				editor.chain().focus().toggleOrderedList().run()
			}
			if (editor.isActive("taskList")) {
				editor.chain().focus().toggleTaskList().run()
			}
			setListSelectValue("")
			return
		}

		if (listValue !== "none") {
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

	const handleListFocus = () => {
		if (listValue === "none") return
		suppressListSyncRef.current = true
		setListSelectValue("")
	}

	const handleListBlur = () => {
		suppressListSyncRef.current = false
		setListSelectValue(listValue === "none" ? "" : listValue)
	}

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result === "string") {
				editor.chain().focus().setImage({ src: reader.result }).run()
			}
		}
		reader.readAsDataURL(file)
		event.target.value = ""
	}

	// Sync list select value with editor state
	useEffect(() => {
		if (suppressListSyncRef.current) return
		setListSelectValue(listValue === "none" ? "" : listValue)
	}, [listValue])

	return (
		<div className="flex flex-wrap gap-1 border-default-200 border-b p-2">
			{/* Undo/Redo */}
			<ToolbarButton
				icon={<TablerArrowBackUp className="size-4" />}
				isDisabled={!editor.can().undo()}
				onPress={() => editor.chain().focus().undo().run()}
				tooltip="Undo"
			/>
			<ToolbarButton
				icon={<TablerArrowForwardUp className="size-4" />}
				isDisabled={!editor.can().redo()}
				onPress={() => editor.chain().focus().redo().run()}
				tooltip="Redo"
			/>

			<ToolbarDivider />

			{/* Headings */}
			<select
				aria-label="Heading level"
				className="h-8 rounded-md border border-default-200 bg-white px-2 text-default-700 text-xs"
				onChange={handleHeadingChange}
				value={headingValue}
			>
				<option disabled value="">
					Heading
				</option>
				<option value="h1">Heading 1</option>
				<option value="h2">Heading 2</option>
				<option value="h3">Heading 3</option>
				<option value="h4">Heading 4</option>
			</select>

			<ToolbarDivider />

			{/* Text formatting */}
			<ToolbarButton
				icon={<TablerBold className="size-4" />}
				isActive={editor.isActive("bold")}
				onPress={() => editor.chain().focus().toggleBold().run()}
				tooltip="Bold"
			/>
			<ToolbarButton
				icon={<TablerItalic className="size-4" />}
				isActive={editor.isActive("italic")}
				onPress={() => editor.chain().focus().toggleItalic().run()}
				tooltip="Italic"
			/>
			<ToolbarButton
				icon={<TablerUnderline className="size-4" />}
				isActive={editor.isActive("underline")}
				onPress={() => editor.chain().focus().toggleUnderline().run()}
				tooltip="Underline"
			/>
			<ToolbarButton
				icon={<TablerStrikethrough className="size-4" />}
				isActive={editor.isActive("strike")}
				onPress={() => editor.chain().focus().toggleStrike().run()}
				tooltip="Strikethrough"
			/>

			<ToolbarDivider />

			{/* Alignment */}
			<ToolbarButton
				icon={<TablerAlignLeft className="size-4" />}
				isActive={editor.isActive({ textAlign: "left" })}
				onPress={() => editor.chain().focus().setTextAlign("left").run()}
				tooltip="Align left"
			/>
			<ToolbarButton
				icon={<TablerAlignCenter className="size-4" />}
				isActive={editor.isActive({ textAlign: "center" })}
				onPress={() => editor.chain().focus().setTextAlign("center").run()}
				tooltip="Align center"
			/>
			<ToolbarButton
				icon={<TablerAlignRight className="size-4" />}
				isActive={editor.isActive({ textAlign: "right" })}
				onPress={() => editor.chain().focus().setTextAlign("right").run()}
				tooltip="Align right"
			/>

			<ToolbarDivider />

			{/* Lists */}
			<select
				aria-label="List type"
				className="h-8 rounded-md border border-default-200 bg-white px-2 text-default-700 text-xs"
				onBlur={handleListBlur}
				onChange={handleListChange}
				onFocus={handleListFocus}
				value={listSelectValue}
			>
				<option disabled value="">
					List
				</option>
				<option value="bullet">Bullet list</option>
				<option value="ordered">Ordered list</option>
				<option value="task">Task list</option>
			</select>

			<ToolbarDivider />

			{/* Blockquote */}
			<ToolbarButton
				icon={<TablerBlockquote className="size-4" />}
				isActive={editor.isActive("blockquote")}
				onPress={() => editor.chain().focus().toggleBlockquote().run()}
				tooltip="Quote"
			/>

			{/* Horizontal rule */}
			<ToolbarButton
				icon={<TablerLine className="size-4" />}
				onPress={() => editor.chain().focus().setHorizontalRule().run()}
				tooltip="Divider"
			/>

			<ToolbarDivider />

			{/* Link */}
			<LinkPopover editor={editor} />

			{/* Image */}
			<Popover isOpen={isImageOpen} onOpenChange={setIsImageOpen}>
				<Tooltip delay={0}>
					<Popover.Trigger>
						<Button isIconOnly size="sm" variant="ghost">
							<TablerPhoto className="size-4" />
						</Button>
					</Popover.Trigger>
					<Tooltip.Content>Insert image</Tooltip.Content>
				</Tooltip>
				<Popover.Content>
					<Popover.Dialog className="p-2">
						<div className="flex gap-2">
							<Input
								placeholder="Image URL"
								value={imageUrl}
								onKeyDown={(e) => e.key === "Enter" && addImage()}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
							/>
							<Button variant="primary" isDisabled={!imageUrl} onPress={addImage} size="sm">
								Add
							</Button>
						</div>
					</Popover.Dialog>
				</Popover.Content>
			</Popover>

			<ToolbarButton
				icon={<TablerCloudUpload className="size-4" />}
				onPress={() => fileInputRef.current?.click()}
				tooltip="Upload image"
			/>
			<input accept="image/*" className="hidden" onChange={handleImageUpload} ref={fileInputRef} type="file" />

			<ToolbarDivider />

			{/* Header/Footer */}
			<ToolbarButton
				icon={<TablerLayoutNavbar className="size-4" />}
				isActive={editor.isActive("emailHeader")}
				onPress={() => editor.chain().focus().insertEmailHeader().run()}
				tooltip="Insert header"
			/>
			<ToolbarButton
				icon={<TablerLayoutNavbarExpand className="size-4" />}
				isActive={editor.isActive("emailFooter")}
				onPress={() => editor.chain().focus().insertEmailFooter().run()}
				tooltip="Insert footer"
			/>

			<ToolbarDivider />

			{/* Clear formatting */}
			<ToolbarButton
				icon={<TablerClearFormatting className="size-4" />}
				onPress={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
				tooltip="Clear formatting"
			/>
		</div>
	)
}

export default EditorToolbar
