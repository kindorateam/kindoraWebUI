import { Avatar, Button, Separator } from "@heroui/react"

import type { StudentParent } from "../../types"

interface ParentTooltipContentProps {
	parents: StudentParent[]
}

const ParentTooltipContent = ({ parents }: ParentTooltipContentProps) => {
	return (
		<div className="flex flex-col gap-3 p-2">
			{parents.map((parent, index) => {
				const fullName = `${parent.firstName} ${parent.lastName}`
				return (
					<div key={parent.id}>
						{index > 0 && <Separator className="mb-3" />}
						<div className="flex items-center gap-2">
							<Avatar size="sm">
								<Avatar.Image src={parent.avatar?.path} alt={fullName} />
								<Avatar.Fallback>{`${parent.firstName[0]}${parent.lastName[0]}`}</Avatar.Fallback>
							</Avatar>
							<span className="font-medium text-sm">{fullName}</span>
						</div>
					</div>
				)
			})}
			<Separator />
			<Button variant="ghost" size="sm">
				New message
			</Button>
		</div>
	)
}

export default ParentTooltipContent
