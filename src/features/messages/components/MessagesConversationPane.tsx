import { Avatar, Button, Chip, Input, ScrollShadow, Spinner, Tooltip } from "@heroui/react"
import clsx from "clsx"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import FluentPerson16Filled from "~icons/fluent/person-16-filled"
import MdiArrowLeft from "~icons/mdi/arrow-left"
import MdiDotsVertical from "~icons/mdi/dots-vertical"
import MdiMagnify from "~icons/mdi/magnify"
import MingcuteSendFill from "~icons/mingcute/send-fill"
import SolarPaperclipLinear from "~icons/solar/paperclip-linear"

import { useConversationScroll } from "../hooks/useConversationScroll"

import ConversationMessageList from "./ConversationMessageList"
import MessageConnectionBanner from "./MessageConnectionBanner"

import type { MessageConnectionState, ThreadItem, ThreadParent } from "../types"

const VISIBLE_PARENT_LIMIT = 2

interface ParentContactDetailsProps {
	parent: ThreadParent
}

const ParentContactDetails = ({ parent }: ParentContactDetailsProps) => {
	const { t } = useTranslation()

	return (
		<div className="min-w-48 space-y-1 px-1 py-0.5">
			<p className="font-medium text-sm">{parent.name}</p>
			<p className="text-xs">
				<span className="text-default-400">{t("messages.parents.email")}: </span>
				<a className="break-all underline underline-offset-2" href={`mailto:${parent.email}`}>
					{parent.email}
				</a>
			</p>
			<p className="text-xs">
				<span className="text-default-400">{t("messages.parents.phone")}: </span>
				{parent.phone ? (
					<a className="underline underline-offset-2" href={`tel:${parent.phone}`}>
						{parent.phone}
					</a>
				) : (
					t("messages.parents.phoneUnavailable")
				)}
			</p>
		</div>
	)
}

interface MessagesConversationPaneProps {
	className?: string
	connection: MessageConnectionState
	hasOlderMessages: boolean
	hasThreads: boolean
	isLoadingMessages: boolean
	isLoadingThreads: boolean
	isMessagesError: boolean
	isOlderMessagesError: boolean
	isLoadingOlderMessages: boolean
	isSendingMessage: boolean
	onBack: () => void
	onLoadOlderMessages: () => Promise<void>
	onReconnect: () => void
	onRetryMessages: () => void
	onSendMessage: (content: string) => Promise<void>
	showBackButton: boolean
	thread: ThreadItem | null
}

const MessagesConversationPane = ({
	className,
	connection,
	hasOlderMessages,
	hasThreads,
	isLoadingMessages,
	isLoadingThreads,
	isMessagesError,
	isOlderMessagesError,
	isLoadingOlderMessages,
	isSendingMessage,
	onBack,
	onLoadOlderMessages,
	onReconnect,
	onRetryMessages,
	onSendMessage,
	showBackButton,
	thread,
}: MessagesConversationPaneProps) => {
	const { t } = useTranslation()
	const [draft, setDraft] = useState("")
	const isConnected = connection.status === "connected"
	const { handleScroll, loadOlderMessages, scrollRef } = useConversationScroll({
		hasOlderMessages,
		isLoadingOlderMessages,
		messageCount: thread?.messages.length ?? 0,
		onLoadOlderMessages,
	})

	if (!thread) {
		return (
			<section className={clsx("min-h-0 w-full", className)}>
				<div className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-default-200 bg-content1">
					<div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
						{isLoadingThreads ? (
							<Spinner aria-label={t("messages.sidebar.loading")} />
						) : (
							<>
								<p className="font-medium text-foreground text-lg">
									{hasThreads ? t("messages.empty.noConversationSelected") : t("messages.empty.noMessages")}
								</p>
								<p className="mt-2 max-w-sm text-default-500 text-sm">
									{hasThreads
										? t("messages.empty.noConversationSelectedDescription")
										: t("messages.empty.noMessagesDescription")}
								</p>
							</>
						)}
					</div>
				</div>
			</section>
		)
	}

	const parentItems = thread.parents
	const visibleParents = parentItems.slice(0, VISIBLE_PARENT_LIMIT)
	const hiddenParents = parentItems.slice(VISIBLE_PARENT_LIMIT)
	const handleSend = async () => {
		const content = draft.trim()
		if (!content || isSendingMessage) return

		try {
			await onSendMessage(content)
			setDraft("")
		} catch {
			return
		}
	}

	return (
		<section className={clsx("min-h-0 w-full", className)}>
			<div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-default-200 bg-content1">
				<div className="flex items-start justify-between gap-2 border-default-200 border-b px-3 py-3 sm:gap-4 sm:px-4">
					<div className="flex min-w-0 flex-1 items-start gap-3">
						{showBackButton ? (
							<Button
								aria-label={t("messages.actions.backToConversations")}
								className="md:hidden"
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
											<Tooltip key={parent.id} delay={0}>
												<Tooltip.Trigger
													aria-label={t("messages.parents.contactDetails", { name: parent.name })}
													className="cursor-pointer"
												>
													<Chip size="sm" variant="soft">
														{parent.name}
													</Chip>
												</Tooltip.Trigger>
												<Tooltip.Content>
													<ParentContactDetails parent={parent} />
												</Tooltip.Content>
											</Tooltip>
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
												<Tooltip.Content className="max-w-72 space-y-2 p-1">
													{hiddenParents.map((parent) => (
														<ParentContactDetails key={parent.id} parent={parent} />
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

					<div className="flex shrink-0 items-center gap-1">
						<Button aria-label={t("messages.actions.searchMessages")} isIconOnly size="sm" variant="ghost">
							<MdiMagnify className="size-5" />
						</Button>
						<Button aria-label={t("messages.actions.moreConversationActions")} isIconOnly size="sm" variant="ghost">
							<MdiDotsVertical className="size-5" />
						</Button>
					</div>
				</div>

				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<MessageConnectionBanner connection={connection} onReconnect={onReconnect} />

					<ScrollShadow
						className="messages-chat-scroll flex-1 px-3 py-4 sm:px-6"
						hideScrollBar
						ref={scrollRef}
						onScroll={handleScroll}
					>
						<ConversationMessageList
							hasOlderMessages={hasOlderMessages}
							isError={isMessagesError}
							isLoading={isLoadingMessages}
							isLoadingOlderMessages={isLoadingOlderMessages}
							isOlderMessagesError={isOlderMessagesError}
							messages={thread.messages}
							onLoadOlderMessages={() => void loadOlderMessages()}
							onRetry={onRetryMessages}
						/>
					</ScrollShadow>

					<div className="border-default-200 border-t p-2.5 sm:p-3">
						<div className="flex items-end gap-2">
							<Button aria-label={t("messages.actions.attachFile")} isDisabled isIconOnly variant="ghost">
								<SolarPaperclipLinear className="size-5" />
							</Button>
							<Input
								aria-label={t("messages.composer.inputAria")}
								className="flex-1"
								disabled={!isConnected || isSendingMessage}
								placeholder={t("messages.composer.placeholder")}
								value={draft}
								variant="secondary"
								onChange={(event) => setDraft(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter" && !event.shiftKey) {
										event.preventDefault()
										void handleSend()
									}
								}}
							/>
							<Button
								aria-label={t("messages.actions.sendMessage")}
								isDisabled={!isConnected || !draft.trim()}
								isIconOnly
								isPending={isSendingMessage}
								variant="primary"
								onPress={() => void handleSend()}
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
