import type { BubbleItem } from "../types"

interface ConversationBubbleProps {
	bubble: BubbleItem
}

const ConversationBubble = ({ bubble }: ConversationBubbleProps) => {
	const isRight = bubble.align === "right"

	return (
		<div className={["flex w-full flex-col", isRight ? "items-end" : "items-start"].join(" ")}>
			<div
				className={[
					"max-w-62 rounded-[30px] px-6 py-4 text-sm leading-5 shadow-sm",
					isRight ? "rounded-tr-2xl bg-primary text-white" : "bg-[#dceafc] text-black",
				].join(" ")}
			>
				{bubble.text.split("\n").map((line) => (
					<p key={line}>{line}</p>
				))}
			</div>
			<p className="px-2 pt-1 text-[#a1a1aa] text-xs leading-4">{bubble.time}</p>
		</div>
	)
}

export default ConversationBubble
