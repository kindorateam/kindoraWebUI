import { Avatar, Badge, Chip } from "@heroui/react"

import StudentActionsDropdown from "./StudentActionsDropdown"

import type { Student } from "../../types"

export function renderCell(student: Student, columnKey: React.Key, roomId: string) {
	switch (columnKey) {
		case "student":
			return (
				<div className="flex items-center gap-3">
					<Badge
						color={student.checkedIn ? "success" : "danger"}
						content=""
						placement="bottom-right"
						shape="circle"
						size="sm"
					>
						<Avatar alt={student.name} showFallback size="sm" src={student.avatar} />
					</Badge>
					<span className="font-medium text-sm">{student.name}</span>
				</div>
			)

		case "parents":
			return (
				<div className="flex flex-wrap gap-1">
					{student.parents.length > 0 ? (
						student.parents.map((parent) => (
							<span key={parent.id} className="text-gray-600 text-sm">
								{parent.name}
							</span>
						))
					) : (
						<span className="text-gray-400 text-sm">No parents assigned</span>
					)}
				</div>
			)

		case "tags":
			return (
				<div className="flex flex-wrap gap-1">
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
