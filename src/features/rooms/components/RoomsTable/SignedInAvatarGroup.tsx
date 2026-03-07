import { Avatar, AvatarGroup, Tooltip } from "@heroui/react"

import { getMediaUrl } from "@/utils/media"

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

const getInitials = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("")

const avatarBaseClassName = "border border-default-300 bg-default-100 shadow-sm"
const avatarFallbackClassName = "font-semibold text-[10px] text-default-600 leading-none"
const avatarImgClassName = "object-cover grayscale saturate-0"
const countAvatarBaseClassName = "border border-default-300 bg-default-200 shadow-sm"
const countAvatarFallbackClassName = "font-semibold text-[11px] text-default-700 leading-none"
const noHoverTranslateClassName =
	"data-[hover=true]:!translate-x-0 data-[focus-visible=true]:!translate-x-0 rtl:data-[hover=true]:!translate-x-0 rtl:data-[focus-visible=true]:!translate-x-0"

const SignedInAvatarGroup = ({ items, tooltipLabel }: SignedInAvatarGroupProps) => {
	if (items.length === 0) {
		return <span className="text-default-400 text-sm">No one</span>
	}

	return (
		<div className="flex justify-center">
			<Tooltip
				closeDelay={0}
				color="primary"
				content={<SignedInTooltipContent items={items} label={tooltipLabel} />}
				delay={300}
			>
				<AvatarGroup
					classNames={{ base: "justify-center" }}
					max={2}
					renderCount={(count) => (
						<Avatar
							classNames={{
								base: `${countAvatarBaseClassName} ${noHoverTranslateClassName}`,
								fallback: countAvatarFallbackClassName,
							}}
							fallback={<span>+{count}</span>}
							showFallback
							size="sm"
						/>
					)}
				>
					{items.map((item) => (
						<Avatar
							classNames={{
								base: `${avatarBaseClassName} ${noHoverTranslateClassName}`,
								fallback: avatarFallbackClassName,
								img: avatarImgClassName,
							}}
							getInitials={getInitials}
							key={item.id}
							name={item.name}
							showFallback
							size="sm"
							src={item.avatar && item.avatar !== "/assets/avatars/default.jpg" ? getMediaUrl(item.avatar) : undefined}
						/>
					))}
				</AvatarGroup>
			</Tooltip>
		</div>
	)
}

export default SignedInAvatarGroup
