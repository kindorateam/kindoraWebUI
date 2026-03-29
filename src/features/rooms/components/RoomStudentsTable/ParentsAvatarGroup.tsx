import { Avatar, Tooltip } from "@heroui/react"

import { getMediaUrl } from "@/utils/media"

import { getAvatarInitials } from "../../utils/avatarInitials"

import ParentTooltipContent from "./ParentTooltipContent"

import type { Parent } from "../../types"

interface ParentsAvatarGroupProps {
	parents: Parent[]
}

const avatarFallbackClassName = "font-semibold text-[10px] text-default-600 leading-none"
const avatarImgClassName = "object-cover grayscale saturate-0"
const countAvatarFallbackClassName = "font-semibold text-[11px] text-default-700 leading-none"

const MAX_VISIBLE = 2

const ParentsAvatarGroup = ({ parents }: ParentsAvatarGroupProps) => {
	if (parents.length === 0) {
		return <span className="text-default-400 text-sm">No parents</span>
	}

	const visible = parents.slice(0, MAX_VISIBLE)
	const overflowCount = parents.length - MAX_VISIBLE

	return (
		<Tooltip delay={300}>
			<Tooltip.Trigger aria-label={`${parents.length} parent${parents.length !== 1 ? "s" : ""}`}>
				<div className="flex -space-x-2">
					{visible.map((parent) => {
						const fullName = `${parent.firstName} ${parent.lastName}`
						return (
							<Avatar key={parent.id} size="sm">
								<Avatar.Image
									src={parent.avatar ? getMediaUrl(parent.avatar) : undefined}
									alt={fullName}
									className={avatarImgClassName}
								/>
								<Avatar.Fallback className={avatarFallbackClassName}>{getAvatarInitials(fullName)}</Avatar.Fallback>
							</Avatar>
						)
					})}
					{overflowCount > 0 && (
						<Avatar size="sm">
							<Avatar.Fallback className={countAvatarFallbackClassName}>+{overflowCount}</Avatar.Fallback>
						</Avatar>
					)}
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<ParentTooltipContent parents={parents} />
			</Tooltip.Content>
		</Tooltip>
	)
}

export default ParentsAvatarGroup
