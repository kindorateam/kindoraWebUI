import MdiStarOutline from "~icons/mdi/star-outline"
import TablerPinned from "~icons/tabler/pinned"

import type { ThreadItem } from "../types"

interface ThreadFavoriteProps {
	favorite: ThreadItem["favorite"]
}

const ThreadFavorite = ({ favorite }: ThreadFavoriteProps) => {
	if (favorite === "pinned") {
		return <TablerPinned className="size-6 shrink-0 text-[#8d8d93]" />
	}

	if (favorite === "highlighted") {
		return <MdiStarOutline className="size-6 shrink-0 text-[#f59e0b]" />
	}

	return <MdiStarOutline className="size-6 shrink-0 text-[#a1a1aa]" />
}

export default ThreadFavorite
