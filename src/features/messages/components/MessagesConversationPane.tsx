import { Avatar, Button, Chip, Input, ScrollShadow } from "@heroui/react"

import MdiAccount from "~icons/mdi/account"
import MdiDotsVertical from "~icons/mdi/dots-vertical"
import MdiMagnify from "~icons/mdi/magnify"
import MdiStarOutline from "~icons/mdi/star-outline"
import MingcuteSendFill from "~icons/mingcute/send-fill"
import SolarPaperclipLinear from "~icons/solar/paperclip-linear"

import ConversationBubble from "./ConversationBubble"

import type { ThreadItem } from "../types"

interface MessagesConversationPaneProps {
	thread: ThreadItem | null
}

const MessagesConversationPane = ({ thread }: MessagesConversationPaneProps) => {
	return (
		<div className="hidden min-h-0 overflow-hidden lg:flex lg:flex-col">
			<div className="rounded-t-[14px] rounded-b-[16px] border border-default-200 bg-white px-4 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 items-start gap-3">
						<Avatar className="bg-primary text-white" size="sm">
							<Avatar.Fallback>
								<MdiAccount className="size-[22.4px] text-white" />
							</Avatar.Fallback>
						</Avatar>
						<div className="min-w-0">
							<p className="text-[14px] text-black leading-5">{thread?.name ?? "No chat selected"}</p>
							<div className="mt-3 flex flex-wrap gap-3">
								{thread?.parents.map((parent) => (
									<Chip key={parent} className="bg-[#bfd8f8] px-2 text-[12px] text-black leading-4" radius="full">
										<div className="flex items-center gap-1">
											<span className="flex size-5 items-center justify-center rounded-full bg-white/80">
												<MdiAccount className="size-3 text-[#8d8d93]" />
											</span>
											<span>{parent}</span>
										</div>
									</Chip>
								))}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button isIconOnly className="text-primary" radius="full" variant="light">
							<MdiStarOutline className="size-6" />
						</Button>
						<Button isIconOnly radius="full" variant="light">
							<MdiMagnify className="size-5 text-[#a1a1aa]" />
						</Button>
						<Button isIconOnly radius="full" variant="light">
							<MdiDotsVertical className="size-5 text-[#a1a1aa]" />
						</Button>
					</div>
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
				<ScrollShadow className="messages-chat-scroll flex-1 px-8 pt-24 pb-4" hideScrollBar>
					<div className="flex flex-col gap-14">
						{thread?.messages.map((bubble) => (
							<ConversationBubble key={bubble.id} bubble={bubble} />
						))}
					</div>
				</ScrollShadow>

				<div className="px-5 pt-3 pb-0">
					<div className="flex items-center gap-3 rounded-[18px] bg-default-100 px-4 py-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
						<Button isIconOnly radius="full" variant="light">
							<SolarPaperclipLinear className="size-6 text-[#a1a1aa]" />
						</Button>
						<Input
							aria-label="Type your message"
							className="flex-1"
							placeholder="Type your message here"
							variant="flat"
						/>
						<Button isIconOnly className="size-12 rounded-full bg-primary text-white" color="primary">
							<MingcuteSendFill className="size-6" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MessagesConversationPane
