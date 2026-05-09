import { Input, Label, TextField } from "@heroui/react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

import ThreadCard from "./ThreadCard"

import type { ThreadItem } from "../types"

interface MessagesSidebarProps {
	children?: React.ReactNode
	className?: string
	hasThreads: boolean
	searchValue: string
	selectedThreadId?: string
	threads: ThreadItem[]
	onSearchChange: (value: string) => void
	onToggleFavorite: (threadId: string) => void
	onThreadSelect: (threadId: string) => void
}

const MessagesSidebar = ({
	children,
	className,
	hasThreads,
	searchValue,
	selectedThreadId,
	threads,
	onSearchChange,
	onToggleFavorite,
	onThreadSelect,
}: MessagesSidebarProps) => {
	const { t } = useTranslation()

	return (
		<section className={clsx("min-h-0 overflow-hidden", className)}>
			<div className="flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-default-200 bg-content1 p-3">
				{children}

				<div className="flex items-end">
					<TextField className="flex-1" variant="secondary">
						<Label>{t("messages.sidebar.searchLabel")}</Label>

						<Input
							aria-label={t("messages.sidebar.searchLabel")}
							placeholder={t("messages.sidebar.searchPlaceholder")}
							value={searchValue}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
						/>
					</TextField>
				</div>

				<div className="messages-thread-scroll min-h-0 flex-1 overflow-y-auto">
					<div className="flex min-h-full flex-col gap-1">
						{threads.length > 0 ? (
							threads.map((item) => (
								<ThreadCard
									key={item.id}
									isSelected={selectedThreadId === item.id}
									item={item}
									onToggleFavorite={onToggleFavorite}
									onPress={onThreadSelect}
								/>
							))
						) : (
							<div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
								<p className="font-medium text-foreground">
									{hasThreads ? t("messages.sidebar.noConversationsFound") : t("messages.empty.noMessages")}
								</p>
								<p className="mt-1 text-default-500 text-sm">
									{hasThreads
										? t("messages.sidebar.noConversationsDescription")
										: t("messages.empty.noMessagesDescription")}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

export default MessagesSidebar
