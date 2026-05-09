import { Avatar, Button, Chip, Input, ScrollShadow, Tooltip } from "@heroui/react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

import FluentPerson16Filled from "~icons/fluent/person-16-filled"
import MdiArrowLeft from "~icons/mdi/arrow-left"
import MdiDotsVertical from "~icons/mdi/dots-vertical"
import MdiMagnify from "~icons/mdi/magnify"
import MingcuteSendFill from "~icons/mingcute/send-fill"
import SolarPaperclipLinear from "~icons/solar/paperclip-linear"

import ConversationBubble from "./ConversationBubble"
import MessageConnectionBanner from "./MessageConnectionBanner"

import type { MessageConnectionState, ThreadItem } from "../types"

const VISIBLE_PARENT_LIMIT = 2

interface MessagesConversationPaneProps {
	className?: string
	connection: MessageConnectionState
	hasThreads: boolean
	onBack: () => void
	onReconnect: () => void
	showBackButton: boolean
	thread: ThreadItem | null
}

const MessagesConversationPane = ({
	className,
	connection,
	hasThreads,
	onBack,
	onReconnect,
	showBackButton,
	thread,
}: MessagesConversationPaneProps) => {
	const { t } = useTranslation()
	const isConnected = connection.status === "connected"

	if (!thread) {
		return (
			<section className={clsx("min-h-0 w-full", className)}>
				<div className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-default-200 bg-content1">
					<div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
						<p className="font-medium text-foreground text-lg">
							{hasThreads ? t("messages.empty.noConversationSelected") : t("messages.empty.noMessages")}
						</p>
						<p className="mt-2 max-w-sm text-default-500 text-sm">
							{hasThreads
								? t("messages.empty.noConversationSelectedDescription")
								: t("messages.empty.noMessagesDescription")}
						</p>
					</div>
				</div>
			</section>
		)
	}

	const parentItems = thread.parents.map((parent, position) => ({
		id: `${thread.id}-parent-${position}`,
		name: parent,
	}))
	const visibleParents = parentItems.slice(0, VISIBLE_PARENT_LIMIT)
	const hiddenParents = parentItems.slice(VISIBLE_PARENT_LIMIT)

	return (
		<section className={clsx("min-h-0 w-full", className)}>
			<div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-default-200 bg-content1">
				<div className="flex items-start justify-between gap-4 border-default-200 border-b px-4 py-3">
					<div className="flex min-w-0 flex-1 items-start gap-3">
						{showBackButton ? (
							<Button
								aria-label={t("messages.actions.backToConversations")}
								className="lg:hidden"
								isIconOnly
								variant="ghost"
								onPress={onBack}
							>
								<MdiArrowLeft className="size-5" />
							</Button>
						) : null}

						<Avatar size="sm">
							<Avatar.Image alt={thread.name} src={thread.avatarUrl} />
							<Avatar.Fallback className="bg-accent text-white">
								<FluentPerson16Filled className="size-6 text-white" />
							</Avatar.Fallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-foreground text-sm leading-5">{thread.name}</p>
							<div className="mt-2 flex flex-wrap gap-2">
								{parentItems.length > 0 ? (
									<>
										{visibleParents.map((parent) => (
											<Chip key={parent.id} size="sm" variant="soft">
												{parent.name}
											</Chip>
										))}
										{hiddenParents.length > 0 ? (
											<Tooltip delay={0}>
												<Tooltip.Trigger
													aria-label={t("messages.parents.moreParents", { count: hiddenParents.length })}
													className="cursor-pointer"
												>
													<Chip size="sm" variant="soft">
														+{hiddenParents.length}
													</Chip>
												</Tooltip.Trigger>
												<Tooltip.Content className="flex max-w-64 flex-wrap gap-1 p-1">
													{hiddenParents.map((parent) => (
														<Chip key={parent.id} size="sm" variant="soft">
															{parent.name}
														</Chip>
													))}
												</Tooltip.Content>
											</Tooltip>
										) : null}
									</>
								) : (
									<p className="text-default-500 text-xs leading-5">{t("messages.parents.noParentsLinked")}</p>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1">
						<Button aria-label={t("messages.actions.searchMessages")} isIconOnly variant="ghost">
							<MdiMagnify className="size-5" />
						</Button>
						<Button aria-label={t("messages.actions.moreConversationActions")} isIconOnly variant="ghost">
							<MdiDotsVertical className="size-5" />
						</Button>
					</div>
				</div>

				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<MessageConnectionBanner connection={connection} onReconnect={onReconnect} />

					<ScrollShadow className="messages-chat-scroll flex-1 px-4 py-4 sm:px-6" hideScrollBar>
						<div className="flex flex-col gap-4">
							{thread.messages.map((bubble) => (
								<ConversationBubble key={bubble.id} bubble={bubble} />
							))}
						</div>
					</ScrollShadow>

					<div className="border-default-200 border-t p-3">
						<div className="flex items-end gap-2">
							<Button aria-label={t("messages.actions.attachFile")} isIconOnly variant="ghost">
								<SolarPaperclipLinear className="size-5" />
							</Button>
							<Input
								aria-label={t("messages.composer.inputAria")}
								className="flex-1"
								disabled={!isConnected}
								placeholder={t("messages.composer.placeholder")}
								variant="secondary"
							/>
							<Button
								aria-label={t("messages.actions.sendMessage")}
								isDisabled={!isConnected}
								isIconOnly
								variant="primary"
							>
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
