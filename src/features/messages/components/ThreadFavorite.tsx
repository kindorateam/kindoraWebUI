import { useTranslation } from "react-i18next"

import MdiStar from "~icons/mdi/star"
import MdiStarOutline from "~icons/mdi/star-outline"

import type { ThreadItem } from "../types"

interface ThreadFavoriteProps {
	favorite: ThreadItem["favorite"]
	onToggle: () => void
}

const ThreadFavorite = ({ favorite, onToggle }: ThreadFavoriteProps) => {
	const { t } = useTranslation()

	return (
		<button
			aria-label={
				favorite === "idle" ? t("messages.actions.addToFavorites") : t("messages.actions.removeFromFavorites")
			}
			className="shrink-0 cursor-pointer rounded-full p-1 text-default-500 transition-colors hover:bg-default-100"
			type="button"
			onClick={onToggle}
		>
			{favorite === "favorite" ? (
				<MdiStar className="size-5 shrink-0 text-warning" />
			) : (
				<MdiStarOutline className="size-5 shrink-0 text-default-300" />
			)}
		</button>
	)
}

export default ThreadFavorite
