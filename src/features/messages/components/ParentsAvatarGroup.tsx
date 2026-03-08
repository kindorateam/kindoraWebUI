import { Avatar, AvatarGroup } from "@heroui/react"

import type { MessageParticipant } from "../types"

const avatarGroupClassName =
	"data-[hover=true]:!translate-x-0 data-[focus-visible=true]:!translate-x-0 rtl:data-[hover=true]:!translate-x-0 rtl:data-[focus-visible=true]:!translate-x-0"

interface ParentsAvatarGroupProps {
	parents: MessageParticipant[]
}

export default function ParentsAvatarGroup({ parents }: ParentsAvatarGroupProps) {
	return (
		<AvatarGroup className="justify-start" max={2} size="sm">
			{parents.map((parent) => (
				<Avatar
					classNames={{ base: avatarGroupClassName }}
					key={parent.id}
					name={parent.name}
					showFallback
					size="sm"
					src={parent.avatar}
				/>
			))}
		</AvatarGroup>
	)
}
