import { Avatar, AvatarGroup, Tooltip } from "@heroui/react"

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
const noHoverTranslateClassName =
	"data-[hover=true]:!translate-x-0 data-[focus-visible=true]:!translate-x-0 rtl:data-[hover=true]:!translate-x-0 rtl:data-[focus-visible=true]:!translate-x-0"

const ParentsAvatarGroup = ({ parents }: ParentsAvatarGroupProps) => {
	if (parents.length === 0) {
		return <span className="text-default-400 text-sm">No parents</span>
	}

	return (
		<Tooltip closeDelay={0} color="primary" content={<ParentTooltipContent parents={parents} />} delay={300}>
			<AvatarGroup
				isBordered
				max={2}
				renderCount={(count) => (
					<Avatar
						color="default"
						classNames={{
							base: noHoverTranslateClassName,
							fallback: countAvatarFallbackClassName,
						}}
						fallback={<span>+{count}</span>}
						isBordered
						showFallback
						size="sm"
					/>
				)}
			>
				{parents.map((parent) => {
					const fullName = `${parent.firstName} ${parent.lastName}`
					return (
						<Avatar
							classNames={{
								base: noHoverTranslateClassName,
								fallback: avatarFallbackClassName,
								img: avatarImgClassName,
							}}
							getInitials={getAvatarInitials}
							isBordered
							key={parent.id}
							name={fullName}
							showFallback
							size="sm"
							src={parent.avatar ? getMediaUrl(parent.avatar) : undefined}
						/>
					)
				})}
			</AvatarGroup>
		</Tooltip>
	)
}

export default ParentsAvatarGroup
