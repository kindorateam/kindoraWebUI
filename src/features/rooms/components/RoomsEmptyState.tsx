import { EmptyState } from "@heroui/react"

import TwemojiEmptyNest from "~icons/twemoji/empty-nest"

interface Props {
	isDeactivatedView?: boolean
}

const RoomsEmptyState = ({ isDeactivatedView = false }: Props) => {
	return (
		<EmptyState className="flex h-131 w-full flex-col items-center justify-center gap-5 py-8 text-center">
			<TwemojiEmptyNest aria-hidden className="size-20" />
			<h3 className="font-semibold text-3xl leading-9">
				{isDeactivatedView ? "No deactivated rooms" : "No rooms added yet"}
			</h3>
			{!isDeactivatedView && <p className="text-lg text-muted leading-7">Please add your first room to get started.</p>}
		</EmptyState>
	)
}

export default RoomsEmptyState
