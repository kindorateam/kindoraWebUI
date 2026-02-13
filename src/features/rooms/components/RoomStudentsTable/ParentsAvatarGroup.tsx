import { Avatar, AvatarGroup, Tooltip } from "@heroui/react"

import { getMediaUrl } from "@/utils/media"

import ParentTooltipContent from "./ParentTooltipContent"

import type { Parent } from "../../types"

interface ParentsAvatarGroupProps {
	parents: Parent[]
}

const avatarGroupNoHoverTranslateClassName =
	"data-[hover=true]:!translate-x-0 data-[focus-visible=true]:!translate-x-0 rtl:data-[hover=true]:!translate-x-0 rtl:data-[focus-visible=true]:!translate-x-0"

const ParentsAvatarGroup = ({ parents }: ParentsAvatarGroupProps) => {
	if (parents.length === 0) {
		return <span className="text-gray-400 text-sm">No parents</span>
	}

	const extraCount = parents.length - 2

	return (
		<Tooltip closeDelay={0} color="primary" content={<ParentTooltipContent parents={parents} />} delay={300}>
			<AvatarGroup>
				{parents.slice(0, 2).map((parent) => {
					const fullName = `${parent.firstName} ${parent.lastName}`
					return (
						<Avatar
							classNames={{ base: avatarGroupNoHoverTranslateClassName }}
							key={parent.id}
							name={fullName}
							showFallback
							size="sm"
							src={parent.avatar ? getMediaUrl(parent.avatar) : undefined}
						/>
					)
				})}
				{extraCount > 0 && (
					<Avatar
						classNames={{
							base: `bg-default-100 text-default-700 ${avatarGroupNoHoverTranslateClassName}`,
							name: "font-semibold text-[10px] leading-none",
						}}
						getInitials={() => `+${extraCount}`}
						name={`+${extraCount}`}
						size="sm"
					/>
				)}
			</AvatarGroup>
		</Tooltip>
	)
}

export default ParentsAvatarGroup
