import { Button, Spinner } from "@heroui/react"
import { useTranslation } from "react-i18next"

import ConversationBubble from "./ConversationBubble"

import type { BubbleItem } from "../types"

interface ConversationMessageListProps {
	hasOlderMessages: boolean
	isError: boolean
	isLoading: boolean
	isLoadingOlderMessages: boolean
	isOlderMessagesError: boolean
	messages: BubbleItem[]
	onLoadOlderMessages: () => void
	onRetry: () => void
}

const ConversationMessageList = ({
	hasOlderMessages,
	isError,
	isLoading,
	isLoadingOlderMessages,
	isOlderMessagesError,
	messages,
	onLoadOlderMessages,
	onRetry,
}: ConversationMessageListProps) => {
	const { t } = useTranslation()

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Spinner aria-label={t("messages.conversation.loading")} />
			</div>
		)
	}

	if (isError) {
		return (
			<div className="flex h-full flex-col items-center justify-center text-center">
				<p className="font-medium text-foreground">{t("messages.conversation.loadError")}</p>
				<Button className="mt-3" size="sm" variant="secondary" onPress={onRetry}>
					{t("messages.conversation.retry")}
				</Button>
			</div>
		)
	}

	if (messages.length === 0) {
		return (
			<div className="flex h-full items-center justify-center text-center text-default-500 text-sm">
				{t("messages.conversation.empty")}
			</div>
		)
	}

	return (
		<div className="flex flex-col">
			{hasOlderMessages || isOlderMessagesError ? (
				<div className="flex flex-col items-center gap-2 pb-1 text-center">
					{isOlderMessagesError ? (
						<p className="text-danger text-xs">{t("messages.conversation.olderLoadError")}</p>
					) : null}
					<Button isPending={isLoadingOlderMessages} size="sm" variant="ghost" onPress={onLoadOlderMessages}>
						{isOlderMessagesError ? t("messages.conversation.retryOlder") : t("messages.conversation.loadOlder")}
					</Button>
				</div>
			) : null}
			{messages.map((bubble, index) => {
				const previous = messages[index - 1]
				const startsDate = !previous || previous.dateKey !== bubble.dateKey
				const startsGroup = startsDate || previous.senderId !== bubble.senderId

				return (
					<div className="contents" key={bubble.id}>
						{startsDate ? (
							<div className="my-3 flex justify-center first:mt-0">
								<span className="rounded-full bg-default-100 px-3 py-1 font-medium text-default-500 text-xs">
									{bubble.dateLabel}
								</span>
							</div>
						) : null}
						<ConversationBubble bubble={bubble} startsGroup={startsGroup} />
					</div>
				)
			})}
		</div>
	)
}

export default ConversationMessageList
