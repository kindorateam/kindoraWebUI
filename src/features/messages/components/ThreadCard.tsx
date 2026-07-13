import { Avatar } from "@heroui/react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

import FluentPerson16Filled from "~icons/fluent/person-16-filled"

import ThreadFavorite from "./ThreadFavorite"

import type { ThreadItem } from "../types"

interface ThreadCardProps {
	isSelected: boolean
	item: ThreadItem
	onToggleFavorite: (threadId: string) => void
	onPress: (threadId: string) => void
}

const ThreadCard = ({ isSelected, item, onPress, onToggleFavorite }: ThreadCardProps) => {
	const { t } = useTranslation()

	return (
		<div
			className={clsx(
				"flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-xl border px-3 py-2.5 transition-colors",
				isSelected
					? "border-accent/20 bg-accent/[0.06]"
					: item.favorite === "favorite"
						? "border-transparent bg-default-100"
						: "border-transparent hover:bg-default-100",
			)}
		>
			<button
				className="flex min-w-0 flex-1 items-center gap-3 text-left"
				type="button"
				onClick={() => onPress(item.id)}
			>
				<Avatar className="shrink-0" size="sm">
					<Avatar.Image alt={item.name} src={item.avatarUrl} />
					<Avatar.Fallback className="bg-accent text-white">
						<FluentPerson16Filled className="size-6 text-white" />
					</Avatar.Fallback>
				</Avatar>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<div className="min-w-0 flex-1">
							<p
								className={clsx(
									"truncate text-foreground text-sm leading-5",
									item.unreadCount ? "font-semibold" : "font-medium",
								)}
							>
								{item.name}
							</p>
						</div>
						<span className="shrink-0 whitespace-nowrap text-default-400 text-xs leading-4">{item.activityLabel}</span>
					</div>

					<div className="mt-1 flex items-center gap-2">
						<p
							className={clsx(
								"min-w-0 flex-1 truncate text-sm leading-5",
								item.unreadCount ? "text-foreground" : "text-default-500",
							)}
						>
							{item.preview}
						</p>
						{item.unreadCount ? (
							<span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-[11px] text-accent-foreground">
								<span aria-hidden>{item.unreadCount > 9 ? "9+" : item.unreadCount}</span>
								<span className="sr-only">{t("messages.thread.newCount", { count: item.unreadCount })}</span>
							</span>
						) : null}
					</div>
				</div>
			</button>

			<ThreadFavorite favorite={item.favorite} onToggle={() => onToggleFavorite(item.id)} />
		</div>
	)
}

export default ThreadCard
