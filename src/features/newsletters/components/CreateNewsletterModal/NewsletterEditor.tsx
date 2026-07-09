import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { hasNewsletterContent } from "../../utils/newsletter-content"
import { isSafeNewsletterLinkUrl, sanitizeNewsletterHtml } from "../../utils/newsletter-html"

import EditorToolbar from "./EditorToolbar"
import { createFooterExtension, createHeaderExtension } from "./extensions/header-footer"
import ResizableImage from "./ResizableImage"

import "./newsletter-editor.css"

interface NewsletterEditorProps {
	content: string
	onContentPresenceChange: (hasContent: boolean) => void
	onEditorContentGetterChange: (getter: (() => string) | null) => void
}

const NewsletterEditor = ({ content, onContentPresenceChange, onEditorContentGetterChange }: NewsletterEditorProps) => {
	const { t } = useTranslation()
	const [editorStateVersion, setEditorStateVersion] = useState(0)
	const footerPlaceholder = t("newsletters.editor.footerPlaceholder")
	const headerPlaceholder = t("newsletters.editor.headerPlaceholder")
	const editorPlaceholder = t("newsletters.editor.placeholder")

	const editor = useEditor(
		{
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
					placeholder: editorPlaceholder,
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
				createHeaderExtension(headerPlaceholder),
				createFooterExtension(footerPlaceholder),
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
		},
		[editorPlaceholder, footerPlaceholder, headerPlaceholder],
	)

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
