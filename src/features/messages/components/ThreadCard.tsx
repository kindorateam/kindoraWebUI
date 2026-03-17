import MdiAccount from "~icons/mdi/account"
import MdiClockTimeFourOutline from "~icons/mdi/clock-time-four-outline"

import ThreadFavorite from "./ThreadFavorite"

import type { ThreadItem } from "../types"

interface ThreadCardProps {
	isSelected: boolean
	item: ThreadItem
	onPress: (threadId: string) => void
}

const ThreadCard = ({ isSelected, item, onPress }: ThreadCardProps) => {
	return (
		<button
			className={[
				"flex w-full items-start justify-between rounded-lg px-2 py-5 text-left transition-colors",
				isSelected ? "bg-[#e6f1fe]" : item.favorite === "highlighted" ? "bg-[rgba(244,244,245,0.5)]" : "bg-white",
			].join(" ")}
			type="button"
			onClick={() => onPress(item.id)}
		>
			<div className="flex min-w-0 items-start gap-2">
				<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
					<MdiAccount className="size-[22.4px] text-white" />
				</div>
				<div className="relative min-w-0">
					<p className="truncate text-[14px] text-black leading-5">{item.name}</p>
					<p className="mt-2 max-w-[221px] text-[#a1a1aa] text-[12px] leading-4">{item.preview}</p>
					<div className="mt-2 flex items-center gap-2 text-[#a1a1aa] text-[12px] leading-4">
						<MdiClockTimeFourOutline className="size-4 shrink-0" />
						<span>{item.dateLabel}</span>
						<span>|</span>
						<span>{item.time}</span>
					</div>
					{item.unreadCount ? (
						<div className="absolute top-[60px] right-0 flex size-6 items-center justify-center rounded-full bg-primary text-[14px] text-white leading-5">
							{item.unreadCount}
						</div>
					) : null}
				</div>
			</div>
			<div className="flex shrink-0 items-center">
				<ThreadFavorite favorite={item.favorite} />
			</div>
		</button>
	)
}

export default ThreadCard
