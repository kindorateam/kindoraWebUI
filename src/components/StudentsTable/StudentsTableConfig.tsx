import { Avatar, Chip } from "@heroui/react"
import { Link } from "@tanstack/react-router"

import RoomIcon from "@/features/rooms/components/RoomIcon"

import type { Student } from "@/types/student"
import type { TableColumn } from "@/types/table"

const createStudentsColumns = (): TableColumn<Student>[] => [
	{
		key: "student",
		label: "Students",
		renderCell: (student) => (
			<Link
				className="flex items-center gap-3 hover:text-primary"
				params={{ studentId: student.id }}
				search={{ tab: "activity" }}
				to="/students/$studentId"
			>
				<Avatar alt={student.name} className="h-10 w-10" showFallback src={student.avatar} />
				<div className="flex flex-col">
					<span className="font-medium text-sm">{student.name}</span>
					{student.status && <span className="text-green-500 text-xs">{student.status}</span>}
				</div>
			</Link>
		),
	},
	{
		key: "parents",
		label: "Parents",
		renderCell: (student) => {
			const { parents } = student
			const displayCount = Math.min(2, parents.length)
			const remainingCount = parents.length - displayCount

			if (parents.length === 0) {
				return <span className="text-gray-400 text-sm">No parents</span>
			}

			return (
				<div className="-space-x-2 flex items-center">
					{parents.slice(0, displayCount).map((parent) => (
						<Avatar
							alt={parent.name}
							className="h-8 w-8 border-2 border-white"
							key={parent.id}
							showFallback
							src={parent.avatar}
						/>
					))}
					{remainingCount > 0 && (
						<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200">
							<span className="font-semibold text-gray-700 text-xs">+{remainingCount}</span>
						</div>
					)}
				</div>
			)
		},
	},
	{
		key: "rooms",
		label: "Rooms",
		renderCell: (student) => {
			if (student.rooms.length === 0) {
				return <span className="text-gray-400 text-sm">No room assigned</span>
			}

			const room = student.rooms[0] // Assuming one primary room per student
			if (!room) {
				return <span className="text-gray-400 text-sm">No room assigned</span>
			}

			return (
				<div className="flex items-center gap-2">
					<RoomIcon roomType={room.icon} />
					<span className="text-sm">{room.name}</span>
				</div>
			)
		},
	},
	{
		key: "tags",
		label: "Tags",
		renderCell: (student) => {
			const { tags } = student
			const displayCount = Math.min(2, tags.length)
			const remainingCount = tags.length - displayCount

			if (tags.length === 0) {
				return <span className="text-gray-400 text-sm">No tags</span>
			}

			return (
				<div className="flex items-center gap-1">
					{tags.slice(0, displayCount).map((tag) => (
						<Chip className={`text-xs ${tag.color}`} key={tag.id} size="sm">
							{tag.name}
						</Chip>
					))}
					{remainingCount > 0 && (
						<Chip className="bg-gray-100 text-gray-800 text-xs" size="sm">
							+{remainingCount}
						</Chip>
					)}
				</div>
			)
		},
	},
]

export default createStudentsColumns
