import { Avatar, AvatarGroup, Tooltip } from "@heroui/react"

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

const avatarGroupNoHoverTranslateClassName =
	"data-[hover=true]:!translate-x-0 data-[focus-visible=true]:!translate-x-0 rtl:data-[hover=true]:!translate-x-0 rtl:data-[focus-visible=true]:!translate-x-0"

const SignedInAvatarGroup = ({ items, tooltipLabel }: SignedInAvatarGroupProps) => {
	if (items.length === 0) {
		return <span className="text-gray-400 text-sm">No one</span>
	}

	const extraCount = items.length - 2

	return (
		<div className="flex justify-center">
			<Tooltip
				closeDelay={0}
				color="primary"
				content={<SignedInTooltipContent items={items} label={tooltipLabel} />}
				delay={300}
			>
				<AvatarGroup>
					{items.slice(0, 2).map((item) => (
						<Avatar
							alt={item.name}
							classNames={{ base: `ring-green-500 ${avatarGroupNoHoverTranslateClassName}` }}
							isBordered
							key={item.id}
							showFallback
							size="sm"
							src={item.avatar}
						/>
					))}
					{extraCount > 0 && (
						<Avatar
							classNames={{
								base: `bg-default-100 text-default-700 ring-green-500 ${avatarGroupNoHoverTranslateClassName}`,
								name: "font-semibold text-[10px] leading-none",
							}}
							getInitials={() => `+${extraCount}`}
							isBordered
							name={`+${extraCount}`}
							size="sm"
						/>
					)}
				</AvatarGroup>
			</Tooltip>
		</div>
	)
}

export default SignedInAvatarGroup
