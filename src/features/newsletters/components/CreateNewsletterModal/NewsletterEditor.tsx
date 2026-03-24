import { Button, Input, Popover, Tooltip } from "@heroui/react"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useCallback, useEffect, useRef, useState } from "react"

import { hasNewsletterContent } from "../../utils/newsletter-content"

import { FooterExtension, HeaderExtension } from "./extensions/header-footer"

import type { NodeViewProps } from "@tiptap/react"
import type React from "react"

import "./newsletter-editor.css"

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
import TablerLink from "~icons/tabler/link"
import TablerPhoto from "~icons/tabler/photo"
import TablerStrikethrough from "~icons/tabler/strikethrough"
import TablerUnderline from "~icons/tabler/underline"

interface NewsletterEditorProps {
	content: string
	onChange: (html: string) => void
}

interface ToolbarButtonProps {
	icon: React.ReactNode
	tooltip: string
	onPress: () => void
	isActive?: boolean
	isDisabled?: boolean
}

const ToolbarButton = ({ icon, tooltip, onPress, isActive = false, isDisabled = false }: ToolbarButtonProps) => (
	<Tooltip delay={500}>
		<Button isIconOnly isDisabled={isDisabled} onPress={onPress} size="sm" variant={isActive ? "secondary" : "ghost"}>
			{icon}
		</Button>
		<Tooltip.Content>{tooltip}</Tooltip.Content>
	</Tooltip>
)

const MIN_IMAGE_WIDTH = 120
const MIN_IMAGE_HEIGHT = 80
const HEADING_LEVELS = [1, 2, 3, 4] as const
type HeadingLevel = (typeof HEADING_LEVELS)[number]

const parseHeadingLevel = (value: string): HeadingLevel | null => {
	const parsed = Number.parseInt(value.replace("h", ""), 10)
	if (Number.isNaN(parsed)) return null
	return HEADING_LEVELS.includes(parsed as HeadingLevel) ? (parsed as HeadingLevel) : null
}

const ResizableImageView = ({ node, updateAttributes, selected }: NodeViewProps) => {
	const { src, alt, title, width, height } = node.attrs
	const style = {
		height: height ? `${height}px` : "auto",
		width: width ? `${width}px` : "auto",
	}

	const handleResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
		event.preventDefault()
		event.stopPropagation()

		const container = event.currentTarget.closest(".newsletter-image-wrapper")
		if (!container) return

		const { width: startWidth, height: startHeight } = container.getBoundingClientRect()
		const startX = event.clientX
		const startY = event.clientY
		const maxWidth = container.parentElement?.clientWidth ?? Number.POSITIVE_INFINITY

		const handlePointerMove = (moveEvent: PointerEvent) => {
			const nextWidth = Math.min(maxWidth, Math.max(MIN_IMAGE_WIDTH, startWidth + (moveEvent.clientX - startX)))
			const nextHeight = Math.max(MIN_IMAGE_HEIGHT, startHeight + (moveEvent.clientY - startY))

			updateAttributes({
				height: Math.round(nextHeight),
				width: Math.round(nextWidth),
			})
		}

		const handlePointerUp = () => {
			window.removeEventListener("pointermove", handlePointerMove)
			window.removeEventListener("pointerup", handlePointerUp)
		}

		window.addEventListener("pointermove", handlePointerMove)
		window.addEventListener("pointerup", handlePointerUp)
	}

	return (
		<NodeViewWrapper
			className={["newsletter-image-wrapper", selected && "is-selected"].filter(Boolean).join(" ")}
			contentEditable={false}
			style={style}
		>
			<img alt={alt ?? ""} className="newsletter-image" src={src} title={title ?? ""} />
			{selected && (
				<button className="newsletter-image-handle" onPointerDown={handleResizeStart} type="button">
					<span className="newsletter-image-handle-dot" />
				</button>
			)}
		</NodeViewWrapper>
	)
}

const ResizableImage = Image.extend({
	addAttributes() {
		const parentAttributes = this.parent?.() ?? {}
		return {
			...parentAttributes,
			height: {
				default: null,
				parseHTML: (element) => {
					const value = element.getAttribute("height")
					return value ? Number.parseInt(value, 10) : null
				},
				renderHTML: (attributes) => (attributes.height ? { height: attributes.height } : {}),
			},
			width: {
				default: null,
				parseHTML: (element) => {
					const value = element.getAttribute("width")
					return value ? Number.parseInt(value, 10) : null
				},
				renderHTML: (attributes) => (attributes.width ? { width: attributes.width } : {}),
			},
		}
	},
	addNodeView() {
		return ReactNodeViewRenderer(ResizableImageView)
	},
})

const NewsletterEditor = ({ content, onChange }: NewsletterEditorProps) => {
	const [linkUrl, setLinkUrl] = useState("")
	const [isLinkOpen, setIsLinkOpen] = useState(false)
	const [imageUrl, setImageUrl] = useState("")
	const [isImageOpen, setIsImageOpen] = useState(false)
	const [, forceUpdate] = useState(0)
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [listSelectValue, setListSelectValue] = useState("")
	const suppressListSyncRef = useRef(false)

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3, 4],
				},
				// Disable built-in Link/Underline to use custom configurations
				link: false,
				underline: false,
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({
				placeholder: "Start writing your newsletter...",
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "newsletter-link",
				},
			}),
			ResizableImage.configure({
				allowBase64: true,
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Underline,
			HeaderExtension,
			FooterExtension,
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
		editorProps: {
			attributes: {
				class: "newsletter-editor",
			},
		},
		immediatelyRender: false,
	})

	// Force re-render on editor state changes to update toolbar button states
	useEffect(() => {
		if (!editor) return

		const updateToolbar = () => forceUpdate((n) => n + 1)

		editor.on("transaction", updateToolbar)
		editor.on("selectionUpdate", updateToolbar)

		return () => {
			editor.off("transaction", updateToolbar)
			editor.off("selectionUpdate", updateToolbar)
		}
	}, [editor])

	useEffect(() => {
		if (!editor) return

		const editorHtml = editor.getHTML()
		const editorHasContent = hasNewsletterContent(editorHtml)
		const incomingHasContent = hasNewsletterContent(content)

		if (!incomingHasContent && !editorHasContent) return
		if (content !== editorHtml) {
			editor.commands.setContent(content || "", { emitUpdate: false })
		}
	}, [content, editor])

	const setLink = useCallback(() => {
		if (!editor) return

		if (linkUrl === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run()
		} else {
			editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
		}

		setLinkUrl("")
		setIsLinkOpen(false)
	}, [editor, linkUrl])

	const addImage = useCallback(() => {
		if (!editor || !imageUrl) return

		editor.chain().focus().setImage({ src: imageUrl }).run()
		setImageUrl("")
		setIsImageOpen(false)
	}, [editor, imageUrl])

	const openLinkPopover = useCallback(() => {
		if (!editor) return

		const previousUrl = editor.getAttributes("link").href || ""
		setLinkUrl(previousUrl)
		setIsLinkOpen(true)
	}, [editor])

	const listValue = editor?.isActive("taskList")
		? "task"
		: editor?.isActive("bulletList")
			? "bullet"
			: editor?.isActive("orderedList")
				? "ordered"
				: "none"

	const handleHeadingChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			if (!editor) return

			const value = event.target.value
			if (value === "paragraph") {
				editor.chain().focus().setParagraph().run()
				return
			}

			const level = parseHeadingLevel(value)
			if (level) {
				editor.chain().focus().setHeading({ level }).run()
			}
		},
		[editor],
	)

	const handleListChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			if (!editor) return

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
		},
		[editor, listValue],
	)

	const handleListFocus = useCallback(() => {
		if (listValue === "none") return
		suppressListSyncRef.current = true
		setListSelectValue("")
	}, [listValue])

	const handleListBlur = useCallback(() => {
		suppressListSyncRef.current = false
		setListSelectValue(listValue === "none" ? "" : listValue)
	}, [listValue])

	const handleImageUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!editor) return

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
		},
		[editor],
	)

	// Sync list select value with editor state (must be before early return)
	useEffect(() => {
		if (suppressListSyncRef.current) return
		setListSelectValue(listValue === "none" ? "" : listValue)
	}, [listValue])

	if (!editor) return null

	const headingValue = editor.isActive("heading", { level: 1 })
		? "h1"
		: editor.isActive("heading", { level: 2 })
			? "h2"
			: editor.isActive("heading", { level: 3 })
				? "h3"
				: editor.isActive("heading", { level: 4 })
					? "h4"
					: ""

	return (
		<div className="flex h-full flex-col">
			{/* Toolbar */}
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

				<div className="mx-1 w-px bg-default-200" />

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

				<div className="mx-1 w-px bg-default-200" />

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

				<div className="mx-1 w-px bg-default-200" />

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

				<div className="mx-1 w-px bg-default-200" />

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

				<div className="mx-1 w-px bg-default-200" />

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

				<div className="mx-1 w-px bg-default-200" />

				{/* Link */}
				<Popover isOpen={isLinkOpen} onOpenChange={setIsLinkOpen}>
					<Tooltip delay={500}>
						<Popover.Trigger>
							<Button
								isIconOnly
								onPress={openLinkPopover}
								size="sm"
								variant={editor.isActive("link") ? "secondary" : "ghost"}
							>
								<TablerLink className="size-4" />
							</Button>
						</Popover.Trigger>
						<Tooltip.Content>Insert link</Tooltip.Content>
					</Tooltip>
					<Popover.Content>
						<Popover.Dialog className="p-2">
							<div className="flex gap-2">
								<Input
									placeholder="https://example.com"
									value={linkUrl}
									onKeyDown={(e) => e.key === "Enter" && setLink()}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
								/>
								<Button variant="primary" onPress={setLink} size="sm">
									{linkUrl ? "Set" : "Remove"}
								</Button>
							</div>
						</Popover.Dialog>
					</Popover.Content>
				</Popover>

				{/* Image */}
				<Popover isOpen={isImageOpen} onOpenChange={setIsImageOpen}>
					<Tooltip delay={500}>
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

				<div className="mx-1 w-px bg-default-200" />

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

				<div className="mx-1 w-px bg-default-200" />

				{/* Clear formatting */}
				<ToolbarButton
					icon={<TablerClearFormatting className="size-4" />}
					onPress={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
					tooltip="Clear formatting"
				/>
			</div>

			{/* Editor */}
			<div className="flex-1 overflow-y-auto bg-white">
				<EditorContent editor={editor} />
			</div>
		</div>
	)
}

export default NewsletterEditor
