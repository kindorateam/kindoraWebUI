import { Button, Input, Popover, Tooltip } from "@heroui/react"
import { useState } from "react"

import TablerLink from "~icons/tabler/link"

import { isSafeNewsletterLinkUrl } from "../../utils/newsletter-html"

import type { Editor } from "@tiptap/react"

interface LinkPopoverProps {
	editor: Editor
}

const LinkPopover = ({ editor }: LinkPopoverProps) => {
	const [linkUrl, setLinkUrl] = useState("")
	const [linkError, setLinkError] = useState("")
	const [isLinkOpen, setIsLinkOpen] = useState(false)

	const setLink = () => {
		const nextLinkUrl = linkUrl.trim()

		if (nextLinkUrl === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run()
		} else {
			if (!isSafeNewsletterLinkUrl(nextLinkUrl)) {
				setLinkError("Use http, https, mailto, tel, anchor, or relative URLs.")
				return
			}

			const didSetLink = editor.chain().focus().extendMarkRange("link").setLink({ href: nextLinkUrl }).run()
			if (!didSetLink) {
				setLinkError("This link could not be applied.")
				return
			}
		}

		setLinkUrl("")
		setLinkError("")
		setIsLinkOpen(false)
	}

	const openLinkPopover = () => {
		const previousUrl = editor.getAttributes("link").href || ""
		setLinkUrl(previousUrl)
		setLinkError("")
		setIsLinkOpen(true)
	}

	return (
		<Popover
			isOpen={isLinkOpen}
			onOpenChange={(isOpen) => {
				setIsLinkOpen(isOpen)
				if (!isOpen) setLinkError("")
			}}
		>
			<Tooltip delay={0}>
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
				<Popover.Dialog>
					<div className="flex flex-col gap-2 p-2">
						<div className="flex gap-2">
							<Input
								placeholder="https://example.com"
								value={linkUrl}
								onKeyDown={(e) => e.key === "Enter" && setLink()}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setLinkUrl(e.target.value)
									setLinkError("")
								}}
							/>
							<Button variant="primary" onPress={setLink} size="sm">
								{linkUrl ? "Set" : "Remove"}
							</Button>
						</div>
						{linkError && <p className="text-danger text-xs">{linkError}</p>}
					</div>
				</Popover.Dialog>
			</Popover.Content>
		</Popover>
	)
}

export default LinkPopover
