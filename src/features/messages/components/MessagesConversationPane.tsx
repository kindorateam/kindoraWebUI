import { Avatar, Button, Chip, Input, ScrollShadow } from "@heroui/react"
import clsx from "clsx"

import MdiAccount from "~icons/mdi/account"
import MdiArrowLeft from "~icons/mdi/arrow-left"
import MdiDotsVertical from "~icons/mdi/dots-vertical"
import MdiMagnify from "~icons/mdi/magnify"
import MingcuteSendFill from "~icons/mingcute/send-fill"
import SolarPaperclipLinear from "~icons/solar/paperclip-linear"

import ConversationBubble from "./ConversationBubble"

import type { ThreadItem } from "../types"

interface MessagesConversationPaneProps {
	className?: string
	onBack: () => void
	showBackButton: boolean
	thread: ThreadItem | null
}

const MessagesConversationPane = ({ className, onBack, showBackButton, thread }: MessagesConversationPaneProps) => {
	if (!thread) {
		return (
			<section className={clsx("min-h-0 w-full", className)}>
				<div className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-default-200 bg-content1">
					<div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
						<p className="font-medium text-foreground text-lg">No conversation selected</p>
						<p className="mt-2 max-w-sm text-default-500 text-sm">
							Choose a conversation from the list to review messages and continue the chat.
						</p>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className={clsx("min-h-0 w-full", className)}>
			<div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-default-200 bg-content1">
				<div className="flex items-start justify-between gap-4 border-default-200 border-b px-4 py-3">
					<div className="flex min-w-0 flex-1 items-start gap-3">
						{showBackButton ? (
							<Button
								aria-label="Back to conversations"
								className="lg:hidden"
								isIconOnly
								variant="ghost"
								onPress={onBack}
							>
								<MdiArrowLeft className="size-5" />
							</Button>
						) : null}

						<Avatar className="bg-primary text-primary-foreground" size="sm">
							<Avatar.Fallback>
								<MdiAccount className="size-4" />
							</Avatar.Fallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-foreground text-sm leading-5">{thread.name}</p>
							<div className="mt-2 flex flex-wrap gap-2">
								{thread.parents.map((parent) => (
									<Chip key={parent} size="sm" variant="soft">
										{parent}
									</Chip>
								))}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1">
						<Button aria-label="Search messages" isIconOnly variant="ghost">
							<MdiMagnify className="size-5" />
						</Button>
						<Button aria-label="More conversation actions" isIconOnly variant="ghost">
							<MdiDotsVertical className="size-5" />
						</Button>
					</div>
				</div>

				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<ScrollShadow className="messages-chat-scroll flex-1 px-4 py-4 sm:px-6" hideScrollBar>
						<div className="flex flex-col gap-4">
							{thread.messages.map((bubble) => (
								<ConversationBubble key={bubble.id} bubble={bubble} />
							))}
						</div>
					</ScrollShadow>

					<div className="border-default-200 border-t p-3">
						<div className="flex items-end gap-2">
							<Button aria-label="Attach file" isIconOnly variant="ghost">
								<SolarPaperclipLinear className="size-5" />
							</Button>
							<Input
								aria-label="Type your message"
								className="flex-1"
								placeholder="Type your message"
								variant="secondary"
							/>
							<Button aria-label="Send message" isIconOnly variant="primary">
								<MingcuteSendFill className="size-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default MessagesConversationPane
