import { Avatar, Tooltip } from "@heroui/react"

import { getMediaUrl } from "@/utils/media"

import { getAvatarInitials } from "../../utils/avatarInitials"

import SignedInTooltipContent from "./SignedInTooltipContent"

interface AvatarItem {
	id: string
	name: string
	avatar: string
}

interface SignedInAvatarGroupProps {
	items: AvatarItem[]
	tooltipLabel: string
}

const avatarFallbackClassName = "font-semibold text-xs text-muted leading-none"
const avatarImgClassName = "object-cover grayscale saturate-0"
const countAvatarFallbackClassName = "font-semibold text-xs text-muted leading-none"

const MAX_VISIBLE = 2

const SignedInAvatarGroup = ({ items, tooltipLabel }: SignedInAvatarGroupProps) => {
	if (items.length === 0) {
		return <span className="text-default-400 text-sm">No one</span>
	}

	const visible = items.slice(0, MAX_VISIBLE)
	const overflowCount = items.length - MAX_VISIBLE

	return (
		<div className="flex justify-center">
			<Tooltip delay={0}>
				<Tooltip.Trigger aria-label={tooltipLabel}>
					<div className="flex -space-x-2">
						{visible.map((item) => (
							<Avatar key={item.id} size="sm">
								<Avatar.Image
									src={
										item.avatar && item.avatar !== "/assets/avatars/default.jpg" ? getMediaUrl(item.avatar) : undefined
									}
									alt={item.name}
									className={avatarImgClassName}
								/>
								<Avatar.Fallback className={avatarFallbackClassName}>{getAvatarInitials(item.name)}</Avatar.Fallback>
							</Avatar>
						))}
						{overflowCount > 0 && (
							<Avatar size="sm">
								<Avatar.Fallback className={countAvatarFallbackClassName}>+{overflowCount}</Avatar.Fallback>
							</Avatar>
						)}
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<SignedInTooltipContent items={items} label={tooltipLabel} />
				</Tooltip.Content>
			</Tooltip>
		</div>
	)
}

export default SignedInAvatarGroup
