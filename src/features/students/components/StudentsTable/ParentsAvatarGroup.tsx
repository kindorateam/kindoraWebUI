import { Avatar, Tooltip } from "@heroui/react"

import ParentTooltipContent from "./ParentTooltipContent"

import type { StudentParent } from "../../types"

interface ParentsAvatarGroupProps {
	parents: StudentParent[]
}

const ParentsAvatarGroup = ({ parents }: ParentsAvatarGroupProps) => {
	if (parents.length === 0) {
		return <span className="text-default-400 text-sm">—</span>
	}

	const extraCount = parents.length - 2

	return (
		<Tooltip>
			<div className="flex -space-x-2">
				{parents.slice(0, 2).map((parent) => {
					const fullName = `${parent.firstName} ${parent.lastName}`
					return (
						<Avatar key={parent.id} size="sm">
							<Avatar.Image src={parent.avatar?.path} alt={fullName} />
							<Avatar.Fallback>{`${parent.firstName[0]}${parent.lastName[0]}`}</Avatar.Fallback>
						</Avatar>
					)
				})}
				{extraCount > 0 && (
					<Avatar className="bg-default-100 text-default-700" size="sm">
						<Avatar.Fallback className="font-semibold text-[10px] leading-none">{`+${extraCount}`}</Avatar.Fallback>
					</Avatar>
				)}
			</div>
			<Tooltip.Content>
				<ParentTooltipContent parents={parents} />
			</Tooltip.Content>
		</Tooltip>
	)
}

export default ParentsAvatarGroup
