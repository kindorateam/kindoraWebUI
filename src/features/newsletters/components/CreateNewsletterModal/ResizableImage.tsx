import Image from "@tiptap/extension-image"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { useEffect, useRef } from "react"

import { type ImageSizeMode, getImageSizeMode } from "./image-toolbar-utils"

import type { NodeViewProps } from "@tiptap/react"
import type React from "react"

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
				updateAttributes({ height: Math.round(startHeight), sizeMode: resizeMode, width: Math.round(nextWidth) })
				return
			}

			if (resizeMode === "height") {
				updateAttributes({ height: Math.round(nextHeight), sizeMode: resizeMode, width: Math.round(startWidth) })
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
				renderHTML: (attributes) => ({ "data-align": getImageAlignment(attributes.align) }),
			},
			sizeMode: {
				default: "width",
				parseHTML: (element) => getImageSizeMode(element.getAttribute("data-size-mode")),
				renderHTML: (attributes) => ({ "data-size-mode": getImageSizeMode(attributes.sizeMode) }),
			},
		}
	},
	addNodeView() {
		return ReactNodeViewRenderer(ResizableImageView)
	},
})

export default ResizableImage
