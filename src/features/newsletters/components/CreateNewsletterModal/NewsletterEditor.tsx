import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useState } from "react"

import { hasNewsletterContent } from "../../utils/newsletter-content"

import EditorToolbar from "./EditorToolbar"
import { FooterExtension, HeaderExtension } from "./extensions/header-footer"

import type { NodeViewProps } from "@tiptap/react"
import type React from "react"

import "./newsletter-editor.css"

interface NewsletterEditorProps {
	content: string
	onChange: (html: string) => void
}

const MIN_IMAGE_WIDTH = 120
const MIN_IMAGE_HEIGHT = 80

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
	const [, forceUpdate] = useState(0)

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3, 4],
				},
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

	if (!editor) return null

	return (
		<div className="flex h-full flex-col">
			<EditorToolbar editor={editor} />

			<div className="flex-1 overflow-y-auto bg-white">
				<EditorContent editor={editor} />
			</div>
		</div>
	)
}

export default NewsletterEditor
