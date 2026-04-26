import clsx from "clsx"

import type { BubbleItem } from "../types"

interface ConversationBubbleProps {
	bubble: BubbleItem
}

const ConversationBubble = ({ bubble }: ConversationBubbleProps) => {
	const isRight = bubble.align === "right"

	return (
		<div className={clsx("flex w-full flex-col gap-1", isRight ? "items-end" : "items-start")}>
			<div
				className={clsx(
					"max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-xl",
					isRight ? "bg-primary text-primary-foreground" : "bg-default-100 text-foreground",
				)}
			>
				<p className="whitespace-pre-line leading-6">{bubble.text}</p>
			</div>
			<p className="px-1 text-default-400 text-xs leading-4">{bubble.time}</p>
		</div>
	)
}

export default ConversationBubble
