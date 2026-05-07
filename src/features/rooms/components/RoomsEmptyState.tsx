import { EmptyState } from "@heroui/react"
import { useTranslation } from "react-i18next"

import FluentEmojiFlatDoor from "~icons/fluent-emoji-flat/door"
import TwemojiEmptyNest from "~icons/twemoji/empty-nest"

interface Props {
	isDeactivatedView?: boolean
}

const RoomsEmptyState = ({ isDeactivatedView = false }: Props) => {
	const { t } = useTranslation()

	return (
		<EmptyState className="flex h-full w-full flex-col items-center justify-center gap-5 py-8 text-center">
			{isDeactivatedView ? (
				<FluentEmojiFlatDoor aria-hidden className="size-20" />
			) : (
				<TwemojiEmptyNest aria-hidden className="size-20" />
			)}
			<h3 className="font-semibold text-3xl leading-9">
				{isDeactivatedView ? t("rooms.emptyState.noDeactivated") : t("rooms.emptyState.title")}
			</h3>
			{!isDeactivatedView && <p className="text-lg text-muted leading-7">{t("rooms.emptyState.description")}</p>}
		</EmptyState>
	)
}

export default RoomsEmptyState
