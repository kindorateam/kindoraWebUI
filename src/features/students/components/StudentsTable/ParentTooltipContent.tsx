import { Avatar, Button, Divider } from "@heroui/react"

import TablerMessage from "~icons/tabler/message"

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
						{index > 0 && <Divider className="mb-3" />}
						<div className="flex items-center gap-2">
							<Avatar name={fullName} showFallback size="sm" src={parent.avatar?.path} />
							<span className="font-medium text-sm">{fullName}</span>
						</div>
					</div>
				)
			})}
			<Divider />
			<Button color="primary" size="sm" startContent={<TablerMessage className="size-4" />} variant="flat">
				New message
			</Button>
		</div>
	)
}

export default ParentTooltipContent
