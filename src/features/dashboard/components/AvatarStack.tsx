import { Avatar } from "@heroui/react"

import { getAvatarUrl, getInitials } from "../utils"

import type { Person } from "../types"

interface AvatarStackProps {
	maxVisible?: number
	people: Person[]
	sizeClassName?: string
}

const AvatarStack = ({ people, maxVisible = 3, sizeClassName = "size-7" }: AvatarStackProps) => {
	const visiblePeople = people.slice(0, maxVisible)
	const overflowCount = people.length - visiblePeople.length

	return (
		<div className="flex items-center">
			{visiblePeople.map((person) => (
				<Avatar className={`-ml-2 ring-2 ring-[#f5f5f5] first:ml-0 ${sizeClassName}`} key={person.seed} size="sm">
					<Avatar.Image alt={person.name} src={getAvatarUrl(person.seed)} />
					<Avatar.Fallback className="bg-[#ebebec] font-medium text-[#18181b] text-[11px]">
						{getInitials(person.name)}
					</Avatar.Fallback>
				</Avatar>
			))}
			{overflowCount > 0 ? (
				<div
					className={`-ml-2 flex items-center justify-center rounded-full bg-[#ebebec] ring-2 ring-[#f5f5f5] ${sizeClassName}`}
				>
					<span className="font-medium text-[#18181b] text-[10px]">+{overflowCount}</span>
				</div>
			) : null}
		</div>
	)
}

export default AvatarStack
