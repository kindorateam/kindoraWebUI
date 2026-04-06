import { Button, Input, Popover, Tooltip } from "@heroui/react"
import { useState } from "react"

import TablerLink from "~icons/tabler/link"

import type { Editor } from "@tiptap/react"

interface LinkPopoverProps {
	editor: Editor
}

const LinkPopover = ({ editor }: LinkPopoverProps) => {
	const [linkUrl, setLinkUrl] = useState("")
	const [isLinkOpen, setIsLinkOpen] = useState(false)

	const setLink = () => {
		if (linkUrl === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run()
		} else {
			editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
		}

		setLinkUrl("")
		setIsLinkOpen(false)
	}

	const openLinkPopover = () => {
		const previousUrl = editor.getAttributes("link").href || ""
		setLinkUrl(previousUrl)
		setIsLinkOpen(true)
	}

	return (
		<Popover isOpen={isLinkOpen} onOpenChange={setIsLinkOpen}>
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
	)
}

export default LinkPopover
