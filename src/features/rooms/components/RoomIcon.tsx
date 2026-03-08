import ClarityAvatarSolid from "~icons/clarity/avatar-solid"

import type { RoomType } from "../types"

const RoomIcon = ({ roomType }: { roomType: RoomType }) => {
	return (
		<div
			className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D6FE8] text-white"
			data-room-type={roomType}
		>
			<ClarityAvatarSolid className="size-4.5" />
		</div>
	)
}

export default RoomIcon
