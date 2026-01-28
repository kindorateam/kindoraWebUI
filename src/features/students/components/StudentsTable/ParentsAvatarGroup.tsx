import { Avatar, AvatarGroup, Tooltip } from "@heroui/react"

import ParentTooltipContent from "./ParentTooltipContent"

import type { StudentParent } from "../../types"

interface ParentsAvatarGroupProps {
	parents: StudentParent[]
}

const avatarGroupNoHoverTranslateClassName =
	"data-[hover=true]:!translate-x-0 data-[focus-visible=true]:!translate-x-0 rtl:data-[hover=true]:!translate-x-0 rtl:data-[focus-visible=true]:!translate-x-0"

const ParentsAvatarGroup = ({ parents }: ParentsAvatarGroupProps) => {
	if (parents.length === 0) {
		return <span className="text-default-400 text-sm">—</span>
	}

	const extraCount = parents.length - 2

	return (
		<Tooltip closeDelay={0} content={<ParentTooltipContent parents={parents} />} delay={300}>
			<AvatarGroup>
				{parents.slice(0, 2).map((parent) => (
					<Avatar
						classNames={{ base: avatarGroupNoHoverTranslateClassName }}
						key={parent.id}
						name={parent.name}
						showFallback
						size="sm"
						src={parent.avatar}
					/>
				))}
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
