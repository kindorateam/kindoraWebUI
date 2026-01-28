import { Avatar, Button, Divider } from "@heroui/react"

import TablerMail from "~icons/tabler/mail"
import TablerMessage from "~icons/tabler/message"
import TablerPhone from "~icons/tabler/phone"
import TablerShieldLock from "~icons/tabler/shield-lock"

import type { StudentParent } from "../../types"

interface ParentTooltipContentProps {
	parents: StudentParent[]
}

const ParentTooltipContent = ({ parents }: ParentTooltipContentProps) => {
	return (
		<div className="flex flex-col gap-3 p-2">
			{parents.map((parent, index) => (
				<div key={parent.id}>
					{index > 0 && <Divider className="mb-3" />}
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<Avatar name={parent.name} showFallback size="sm" src={parent.avatar} />
							<span className="font-medium text-sm">{parent.name}</span>
						</div>
						<div className="flex flex-col gap-1 text-default-500 text-xs">
							{parent.email && (
								<div className="flex items-center gap-2">
									<TablerMail className="size-4" />
									<span>{parent.email}</span>
								</div>
							)}
							{parent.phone && (
								<div className="flex items-center gap-2">
									<TablerPhone className="size-4" />
									<span>{parent.phone}</span>
								</div>
							)}
							{parent.pin && (
								<div className="flex items-center gap-2">
									<TablerShieldLock className="size-4" />
									<span>PIN: {parent.pin}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			))}
			<Divider />
			<Button color="primary" size="sm" startContent={<TablerMessage className="size-4" />} variant="flat">
				New message
			</Button>
		</div>
	)
}

export default ParentTooltipContent
