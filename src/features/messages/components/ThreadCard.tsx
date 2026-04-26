import { Avatar } from "@heroui/react"
import clsx from "clsx"

import MdiAccount from "~icons/mdi/account"
import MdiClockTimeFourOutline from "~icons/mdi/clock-time-four-outline"

import ThreadFavorite from "./ThreadFavorite"

import type { ThreadItem } from "../types"

interface ThreadCardProps {
	isSelected: boolean
	item: ThreadItem
	onToggleFavorite: (threadId: string) => void
	onPress: (threadId: string) => void
}

const ThreadCard = ({ isSelected, item, onPress, onToggleFavorite }: ThreadCardProps) => {
	return (
		<div
			className={clsx(
				"flex w-full items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
				isSelected
					? "border-primary/30 bg-primary/10"
					: item.favorite === "highlighted"
						? "border-transparent bg-default-100"
						: "border-transparent hover:bg-default-100",
			)}
		>
			<button
				className="flex min-w-0 flex-1 items-start gap-3 text-left"
				type="button"
				onClick={() => onPress(item.id)}
			>
				<Avatar className="shrink-0 bg-primary text-primary-foreground" size="sm">
					<Avatar.Fallback>
						<MdiAccount className="size-4" />
					</Avatar.Fallback>
				</Avatar>

				<div className="min-w-0 flex-1">
					<div className="flex items-start gap-3">
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-foreground text-sm leading-5">{item.name}</p>
							<p className="mt-1 line-clamp-2 text-default-500 text-sm leading-5">{item.preview}</p>
						</div>
						<div className="flex shrink-0 flex-col items-end gap-2">
							<span className="whitespace-nowrap text-default-400 text-xs leading-4">{item.time}</span>
						</div>
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-2 text-default-400 text-xs leading-4">
						<div className="flex items-center gap-1.5">
							<MdiClockTimeFourOutline className="size-4 shrink-0" />
							<span>{item.dateLabel}</span>
						</div>
						{item.unreadCount ? (
							<span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 font-medium text-[11px] text-white">
								{item.unreadCount} new
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
