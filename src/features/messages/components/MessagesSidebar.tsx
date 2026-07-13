import { Button, Input, Label, Spinner, TextField } from "@heroui/react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

import ThreadCard from "./ThreadCard"

import type { ThreadItem } from "../types"

interface MessagesSidebarProps {
	children?: React.ReactNode
	className?: string
	hasThreads: boolean
	hasMore: boolean
	isError: boolean
	isLoading: boolean
	isLoadingMore: boolean
	isLoadMoreError: boolean
	searchValue: string
	selectedThreadId?: string
	threads: ThreadItem[]
	onSearchChange: (value: string) => void
	onLoadMore: () => void
	onRetry: () => void
	onToggleFavorite: (threadId: string) => void
	onThreadSelect: (threadId: string) => void
}

const MessagesSidebar = ({
	children,
	className,
	hasThreads,
	hasMore,
	isError,
	isLoading,
	isLoadingMore,
	isLoadMoreError,
	searchValue,
	selectedThreadId,
	threads,
	onSearchChange,
	onLoadMore,
	onRetry,
	onToggleFavorite,
	onThreadSelect,
}: MessagesSidebarProps) => {
	const { t } = useTranslation()
	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		if (!hasMore || isLoadingMore) return
		const target = event.currentTarget
		if (target.scrollHeight - target.scrollTop - target.clientHeight <= 80) onLoadMore()
	}

	return (
		<section className={clsx("min-h-0 min-w-0 overflow-hidden", className)}>
			<div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-default-200 bg-content1 p-3 md:rounded-r-none">
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

				<div className="messages-thread-scroll min-h-0 min-w-0 flex-1 overflow-y-auto" onScroll={handleScroll}>
					<div className="flex min-h-full flex-col gap-1">
						{isLoading ? (
							<div className="flex flex-1 items-center justify-center">
								<Spinner aria-label={t("messages.sidebar.loading")} />
							</div>
						) : isError ? (
							<div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
								<p className="font-medium text-foreground">{t("messages.sidebar.loadError")}</p>
								<Button className="mt-3" size="sm" variant="secondary" onPress={onRetry}>
									{t("messages.sidebar.retry")}
								</Button>
							</div>
						) : threads.length > 0 ? (
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
						{isLoadingMore ? (
							<div className="flex justify-center py-3">
								<Spinner aria-label={t("messages.sidebar.loading")} size="sm" />
							</div>
						) : null}
						{isLoadMoreError ? (
							<div className="flex flex-col items-center gap-2 py-3 text-center">
								<p className="text-default-500 text-xs">{t("messages.sidebar.loadMoreError")}</p>
								<Button size="sm" variant="secondary" onPress={onLoadMore}>
									{t("messages.sidebar.retry")}
								</Button>
							</div>
						) : null}
						{hasMore && !isLoadingMore && !isLoadMoreError ? (
							<div className="flex justify-center py-3">
								<Button size="sm" variant="tertiary" onPress={onLoadMore}>
									{t("messages.sidebar.loadMore")}
								</Button>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	)
}

export default MessagesSidebar
