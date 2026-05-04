import { Button, Input, Popover, Tooltip } from "@heroui/react"
import { useState } from "react"

import TablerPhoto from "~icons/tabler/photo"

import { isSafeNewsletterImageUrl } from "../../utils/newsletter-html"

import type { Editor } from "@tiptap/react"
import type React from "react"

interface ImageToolbarControlsProps {
	editor: Editor
}

const ImageToolbarControls = ({ editor }: ImageToolbarControlsProps) => {
	const [imageUrl, setImageUrl] = useState("")
	const [imageError, setImageError] = useState("")
	const [isImageOpen, setIsImageOpen] = useState(false)

	const addImage = () => {
		const nextImageUrl = imageUrl.trim()
		if (!nextImageUrl) return

		if (!isSafeNewsletterImageUrl(nextImageUrl)) {
			setImageError("Use a same-origin or configured media URL.")
			return
		}

		editor.chain().focus().setImage({ src: nextImageUrl }).run()
		setImageUrl("")
		setImageError("")
		setIsImageOpen(false)
	}

	return (
		<Popover
			isOpen={isImageOpen}
			onOpenChange={(isOpen) => {
				setIsImageOpen(isOpen)
				if (!isOpen) setImageError("")
			}}
		>
			<Tooltip delay={0}>
				<Popover.Trigger>
					<Button isIconOnly size="sm" variant="ghost">
						<TablerPhoto className="size-4" />
					</Button>
				</Popover.Trigger>
				<Tooltip.Content>Insert image</Tooltip.Content>
			</Tooltip>
			<Popover.Content>
				<Popover.Dialog>
					<div className="flex flex-col gap-2 p-2">
						<div className="flex gap-2">
							<Input
								placeholder="Image URL"
								value={imageUrl}
								onKeyDown={(event) => event.key === "Enter" && addImage()}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setImageUrl(event.target.value)
									setImageError("")
								}}
							/>
							<Button variant="primary" isDisabled={!imageUrl} onPress={addImage} size="sm">
								Add
							</Button>
						</div>
						{imageError && <p className="text-danger text-xs">{imageError}</p>}
					</div>
				</Popover.Dialog>
			</Popover.Content>
		</Popover>
	)
}

export default ImageToolbarControls
