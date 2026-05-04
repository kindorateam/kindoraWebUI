import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useRef, useState } from "react"

import { hasNewsletterContent } from "../../utils/newsletter-content"
import { isSafeNewsletterLinkUrl, sanitizeNewsletterHtml } from "../../utils/newsletter-html"

import EditorToolbar from "./EditorToolbar"
import { FooterExtension, HeaderExtension } from "./extensions/header-footer"
import { type ImageSizeMode, getImageSizeMode } from "./image-toolbar-utils"

import type { NodeViewProps } from "@tiptap/react"
import type React from "react"

import "./newsletter-editor.css"

interface NewsletterEditorProps {
	content: string
	onContentPresenceChange: (hasContent: boolean) => void
	onEditorContentGetterChange: (getter: (() => string) | null) => void
}

const MIN_IMAGE_WIDTH = 120
const MIN_IMAGE_HEIGHT = 80
const IMAGE_ALIGNMENTS = ["left", "center", "right"] as const
type ImageAlignment = (typeof IMAGE_ALIGNMENTS)[number]

const getImageAlignment = (value: unknown): ImageAlignment =>
	typeof value === "string" && IMAGE_ALIGNMENTS.includes(value as ImageAlignment) ? (value as ImageAlignment) : "left"

const ResizableImageView = ({ node, updateAttributes, selected }: NodeViewProps) => {
	const { src, alt, title, width, height, align, sizeMode } = node.attrs
	const resizeCleanupRef = useRef<(() => void) | null>(null)
	const imageAlignment = getImageAlignment(align)
	const imageSizeMode = getImageSizeMode(sizeMode)
	const style: React.CSSProperties = {
		height: height ? `${height}px` : "auto",
		marginLeft: imageAlignment === "center" || imageAlignment === "right" ? "auto" : undefined,
		marginRight: imageAlignment === "center" || imageAlignment === "left" ? "auto" : undefined,
		maxWidth: "100%",
		width: width ? `${width}px` : "auto",
	}

	useEffect(() => () => resizeCleanupRef.current?.(), [])

	const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>, resizeMode: ImageSizeMode) => {
		event.preventDefault()
		event.stopPropagation()

		const container = event.currentTarget.closest(".newsletter-image-wrapper")
		if (!container) return

		const { width: startWidth, height: startHeight } = container.getBoundingClientRect()
		const startX = event.clientX
		const startY = event.clientY
		const startRatio = startHeight / startWidth
		const maxWidth = container.parentElement?.clientWidth ?? Number.POSITIVE_INFINITY

		const handlePointerMove = (moveEvent: PointerEvent) => {
			const nextWidth = Math.min(maxWidth, Math.max(MIN_IMAGE_WIDTH, startWidth + (moveEvent.clientX - startX)))
			const nextHeight = Math.max(MIN_IMAGE_HEIGHT, startHeight + (moveEvent.clientY - startY))

			if (resizeMode === "width") {
				updateAttributes({
					height: Math.round(startHeight),
					sizeMode: resizeMode,
					width: Math.round(nextWidth),
				})
				return
			}

			if (resizeMode === "height") {
				updateAttributes({
					height: Math.round(nextHeight),
					sizeMode: resizeMode,
					width: Math.round(startWidth),
				})
				return
			}

			updateAttributes({
				height: Math.round(nextWidth * startRatio),
				sizeMode: resizeMode,
				width: Math.round(nextWidth),
			})
		}

		resizeCleanupRef.current?.()

		const cleanupResize = () => {
			window.removeEventListener("pointermove", handlePointerMove)
			window.removeEventListener("pointerup", cleanupResize)
			window.removeEventListener("pointercancel", cleanupResize)
			window.removeEventListener("blur", cleanupResize)
			resizeCleanupRef.current = null
		}

		window.addEventListener("pointermove", handlePointerMove)
		window.addEventListener("pointerup", cleanupResize)
		window.addEventListener("pointercancel", cleanupResize)
		window.addEventListener("blur", cleanupResize)
		resizeCleanupRef.current = cleanupResize
	}

	return (
		<NodeViewWrapper
			className={["newsletter-image-wrapper", selected && "is-selected"].filter(Boolean).join(" ")}
			contentEditable={false}
			data-align={imageAlignment}
			data-sized={width || height ? "true" : undefined}
			data-size-mode={imageSizeMode}
			style={style}
		>
			<img alt={alt ?? ""} className="newsletter-image" src={src} title={title ?? ""} />
			{selected && (
				<>
					<div
						className="newsletter-image-resize-handle newsletter-image-resize-handle-width"
						data-resize-handle="width"
						onPointerDown={(event) => handleResizeStart(event, "width")}
					/>
					<div
						className="newsletter-image-resize-handle newsletter-image-resize-handle-height"
						data-resize-handle="height"
						onPointerDown={(event) => handleResizeStart(event, "height")}
					/>
					<div
						className="newsletter-image-resize-handle newsletter-image-resize-handle-ratio"
						data-resize-handle="aspect-ratio"
						onPointerDown={(event) => handleResizeStart(event, "aspect-ratio")}
					>
						<span className="newsletter-image-handle-dot" />
					</div>
				</>
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
			align: {
				default: "left",
				parseHTML: (element) => getImageAlignment(element.getAttribute("data-align")),
				renderHTML: (attributes) => ({
					"data-align": getImageAlignment(attributes.align),
				}),
			},
			sizeMode: {
				default: "width",
				parseHTML: (element) => getImageSizeMode(element.getAttribute("data-size-mode")),
				renderHTML: (attributes) => ({
					"data-size-mode": getImageSizeMode(attributes.sizeMode),
				}),
			},
		}
	},
	addNodeView() {
		return ReactNodeViewRenderer(ResizableImageView)
	},
})

const NewsletterEditor = ({ content, onContentPresenceChange, onEditorContentGetterChange }: NewsletterEditorProps) => {
	const [editorStateVersion, setEditorStateVersion] = useState(0)

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
				isAllowedUri: (url) => isSafeNewsletterLinkUrl(url),
				HTMLAttributes: {
					class: "newsletter-link",
				},
			}),
			ResizableImage,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Underline,
			HeaderExtension,
			FooterExtension,
		],
		content,
		onUpdate: ({ editor }) => {
			onContentPresenceChange(!editor.isEmpty)
		},
		editorProps: {
			attributes: {
				class: "newsletter-editor",
			},
		},
		immediatelyRender: false,
	})

	// Keep derived toolbar state in one subscription instead of per-control listeners.
	useEffect(() => {
		if (!editor) return

		const updateToolbar = () => setEditorStateVersion((version) => version + 1)

		editor.on("transaction", updateToolbar)
		editor.on("selectionUpdate", updateToolbar)

		return () => {
			editor.off("transaction", updateToolbar)
			editor.off("selectionUpdate", updateToolbar)
		}
	}, [editor])

	useEffect(() => {
		if (!editor) {
			onEditorContentGetterChange(null)
			return
		}

		onEditorContentGetterChange(() => sanitizeNewsletterHtml(editor.getHTML()))

		return () => onEditorContentGetterChange(null)
	}, [editor, onEditorContentGetterChange])

	useEffect(() => {
		if (!editor) return

		const editorHtml = editor.getHTML()
		const editorHasContent = hasNewsletterContent(editorHtml)
		const incomingHasContent = hasNewsletterContent(content)

		if (!incomingHasContent && !editorHasContent) return
		if (content !== editorHtml) {
			editor.commands.setContent(content || "", { emitUpdate: false })
			onContentPresenceChange(hasNewsletterContent(editor.getHTML()))
		}
	}, [content, editor, onContentPresenceChange])

	if (!editor) return null

	return (
		<div className="flex h-full flex-col">
			<EditorToolbar editor={editor} editorStateVersion={editorStateVersion} />

			<div className="flex-1 overflow-y-auto bg-white">
				<EditorContent editor={editor} />
			</div>
		</div>
	)
}

export default NewsletterEditor
