import { EmptyState } from "@heroui/react"
import { useTranslation } from "react-i18next"

import TwemojiEmptyNest from "~icons/twemoji/empty-nest"

const StudentsEmptyState = () => {
	const { t } = useTranslation()

	return (
		<EmptyState className="flex h-131 w-full flex-col items-center justify-center gap-5 py-8 text-center">
			<div className="relative h-22.25 w-20 overflow-clip">
				<TwemojiEmptyNest aria-hidden className="size-full text-primary" />
			</div>
			<div className="flex flex-col gap-5">
				<h3 className="font-semibold text-3xl leading-9">{t("students.emptyState.title")}</h3>
				<p className="text-default-700 text-lg leading-7">{t("students.emptyState.description")}</p>
			</div>
		</EmptyState>
	)
}

export default StudentsEmptyState
