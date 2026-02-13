import type { Parent } from "../../types"

interface ParentTooltipContentProps {
	parents: Parent[]
}

const ParentTooltipContent = ({ parents }: ParentTooltipContentProps) => {
	return (
		<div className="flex flex-col gap-1">
			{parents.map((parent) => (
				<p key={parent.id}>{parent.firstName} {parent.lastName}</p>
			))}
		</div>
	)
}

export default ParentTooltipContent
