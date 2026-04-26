import MdiStarOutline from "~icons/mdi/star-outline"
import TablerPinned from "~icons/tabler/pinned"

import type { ThreadItem } from "../types"

interface ThreadFavoriteProps {
	favorite: ThreadItem["favorite"]
	onToggle: () => void
}

const ThreadFavorite = ({ favorite, onToggle }: ThreadFavoriteProps) => {
	return (
		<button
			aria-label={favorite === "idle" ? "Add to favorites" : "Remove from favorites"}
			className="shrink-0 rounded-full p-1 text-default-500 transition-colors hover:bg-default-100"
			type="button"
			onClick={onToggle}
		>
			{favorite === "pinned" ? (
				<TablerPinned className="size-5 shrink-0 text-default-500" />
			) : favorite === "highlighted" ? (
				<MdiStarOutline className="size-5 shrink-0 text-warning" />
			) : (
				<MdiStarOutline className="size-5 shrink-0 text-default-300" />
			)}
		</button>
	)
}

export default ThreadFavorite
