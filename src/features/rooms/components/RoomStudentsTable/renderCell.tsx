import { Avatar, Chip } from "@heroui/react"

import type { Student } from "../../types"

export function renderCell(student: Student, columnKey: React.Key) {
	switch (columnKey) {
		case "student":
			return (
				<div className="flex items-center gap-3">
					<Avatar alt={student.name} className="size-10" showFallback src={student.avatar} />
					<span className="font-medium text-sm">{student.name}</span>
				</div>
			)

		case "status":
			return (
				<div className="flex justify-center">
					{student.checkedIn ? (
						<Chip className="bg-green-50 text-green-700" size="sm">
							Checked In
						</Chip>
					) : (
						<Chip className="bg-gray-100 text-gray-600" size="sm">
							Not Checked In
						</Chip>
					)}
				</div>
			)

		default:
			return null
	}
}
