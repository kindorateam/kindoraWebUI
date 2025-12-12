import { Button, Input, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useCallback, useEffect, useState } from "react"

import "./newsletter-editor.css"

import TablerAlignCenter from "~icons/tabler/align-center"
import TablerAlignLeft from "~icons/tabler/align-left"
import TablerAlignRight from "~icons/tabler/align-right"
import TablerArrowBackUp from "~icons/tabler/arrow-back-up"
import TablerArrowForwardUp from "~icons/tabler/arrow-forward-up"
import TablerBlockquote from "~icons/tabler/blockquote"
import TablerBold from "~icons/tabler/bold"
import TablerClearFormatting from "~icons/tabler/clear-formatting"
import TablerH1 from "~icons/tabler/h-1"
import TablerH2 from "~icons/tabler/h-2"
import TablerItalic from "~icons/tabler/italic"
import TablerLine from "~icons/tabler/line"
import TablerLink from "~icons/tabler/link"
import TablerList from "~icons/tabler/list"
import TablerListNumbers from "~icons/tabler/list-numbers"
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
	<Tooltip content={tooltip} delay={500} closeDelay={0}>
		<Button
			isIconOnly
			isDisabled={isDisabled}
			onPress={onPress}
			size="sm"
			tabIndex={-1}
			variant={isActive ? "flat" : "light"}
		>
			{icon}
		</Button>
	</Tooltip>
)

const NewsletterEditor = ({ content, onChange }: NewsletterEditorProps) => {
	const [linkUrl, setLinkUrl] = useState("")
	const [isLinkOpen, setIsLinkOpen] = useState(false)
	const [imageUrl, setImageUrl] = useState("")
	const [isImageOpen, setIsImageOpen] = useState(false)
	const [, forceUpdate] = useState(0)

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Placeholder.configure({
				placeholder: "Start writing your newsletter...",
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "newsletter-link",
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class: "newsletter-image",
				},
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Underline,
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

	if (!editor) return null

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
				<ToolbarButton
					icon={<TablerH1 className="size-4" />}
					isActive={editor.isActive("heading", { level: 1 })}
					onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					tooltip="Heading 1"
				/>
				<ToolbarButton
					icon={<TablerH2 className="size-4" />}
					isActive={editor.isActive("heading", { level: 2 })}
					onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					tooltip="Heading 2"
				/>

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
				<ToolbarButton
					icon={<TablerList className="size-4" />}
					isActive={editor.isActive("bulletList")}
					onPress={() => editor.chain().focus().toggleBulletList().run()}
					tooltip="Bullet list"
				/>
				<ToolbarButton
					icon={<TablerListNumbers className="size-4" />}
					isActive={editor.isActive("orderedList")}
					onPress={() => editor.chain().focus().toggleOrderedList().run()}
					tooltip="Numbered list"
				/>

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
				<Popover isOpen={isLinkOpen} onOpenChange={setIsLinkOpen} placement="bottom">
					<Tooltip content="Insert link" delay={500} closeDelay={0}>
						<div>
							<PopoverTrigger>
								<Button
									isIconOnly
									onPress={openLinkPopover}
									size="sm"
									tabIndex={-1}
									variant={editor.isActive("link") ? "flat" : "light"}
								>
									<TablerLink className="size-4" />
								</Button>
							</PopoverTrigger>
						</div>
					</Tooltip>
					<PopoverContent className="p-2">
						<div className="flex gap-2">
							<Input
								placeholder="https://example.com"
								size="sm"
								value={linkUrl}
								onKeyDown={(e) => e.key === "Enter" && setLink()}
								onValueChange={setLinkUrl}
							/>
							<Button color="primary" onPress={setLink} size="sm">
								{linkUrl ? "Set" : "Remove"}
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				{/* Image */}
				<Popover isOpen={isImageOpen} onOpenChange={setIsImageOpen} placement="bottom">
					<Tooltip content="Insert image" delay={500} closeDelay={0}>
						<div>
							<PopoverTrigger>
								<Button isIconOnly size="sm" tabIndex={-1} variant="light">
									<TablerPhoto className="size-4" />
								</Button>
							</PopoverTrigger>
						</div>
					</Tooltip>
					<PopoverContent className="p-2">
						<div className="flex gap-2">
							<Input
								placeholder="Image URL"
								size="sm"
								value={imageUrl}
								onKeyDown={(e) => e.key === "Enter" && addImage()}
								onValueChange={setImageUrl}
							/>
							<Button color="primary" isDisabled={!imageUrl} onPress={addImage} size="sm">
								Add
							</Button>
						</div>
					</PopoverContent>
				</Popover>

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
