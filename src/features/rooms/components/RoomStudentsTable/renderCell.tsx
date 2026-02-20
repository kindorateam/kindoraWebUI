import { Avatar, Badge, Chip } from "@heroui/react"

import ParentsAvatarGroup from "./ParentsAvatarGroup"
import StudentActionsDropdown from "./StudentActionsDropdown"

import type { Student } from "../../types"

export function renderCell(student: Student, columnKey: React.Key, roomId: string) {
	switch (columnKey) {
		case "student":
			return (
				<div className="flex items-center gap-3">
					<Badge
						isDot
						color={student.checkedIn ? "success" : "danger"}
						placement="bottom-right"
						shape="circle"
						classNames={{ badge: "size-2" }}
					>
						<Avatar alt={student.name} classNames={{ base: "size-9 text-small" }} showFallback src={student.avatar} />
					</Badge>
					<span className="font-medium text-sm">{student.name}</span>
				</div>
			)

		case "parents":
			return (
				<div className="flex justify-center">
					<ParentsAvatarGroup parents={student.parents} />
				</div>
			)

		case "tags":
			return (
				<div className="flex flex-wrap justify-center gap-1">
					{student.tags.length > 0 ? (
						student.tags.map((tag) => (
							<Chip key={tag} className="bg-gray-100 text-gray-600" size="sm">
								{tag}
							</Chip>
						))
					) : (
						<span className="text-gray-400 text-sm">No tags</span>
					)}
				</div>
			)

		case "actions":
			return <StudentActionsDropdown roomId={roomId} student={student} />

		default:
			return null
	}
}
