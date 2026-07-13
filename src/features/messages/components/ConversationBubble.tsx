import clsx from "clsx"

import type { BubbleItem } from "../types"

interface ConversationBubbleProps {
	bubble: BubbleItem
	startsGroup: boolean
}

const ConversationBubble = ({ bubble, startsGroup }: ConversationBubbleProps) => {
	const isRight = bubble.align === "right"

	return (
		<div className={clsx("flex w-full flex-col", startsGroup ? "mt-4" : "mt-1", isRight ? "items-end" : "items-start")}>
			{startsGroup && !isRight ? (
				<p className="mb-1 px-1 font-medium text-default-500 text-xs">{bubble.senderName}</p>
			) : null}
			<div
				className={clsx(
					"min-w-0 max-w-[88%] overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[75%]",
					isRight
						? "bg-accent text-accent-foreground shadow-sm"
						: "border border-default-300 bg-default-100 text-foreground",
					!startsGroup && (isRight ? "rounded-tr-md" : "rounded-tl-md"),
				)}
			>
				<p className="flow-root min-w-0 whitespace-pre-line break-all leading-6">
					{bubble.text}
					<span
						className={clsx(
							"float-right mt-2 ml-2 whitespace-nowrap text-[10px] leading-none",
							isRight ? "text-accent-foreground/70" : "text-default-400",
						)}
					>
						{bubble.time}
					</span>
				</p>
			</div>
		</div>
	)
}

export default ConversationBubble
