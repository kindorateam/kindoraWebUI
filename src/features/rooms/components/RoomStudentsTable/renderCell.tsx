import { Avatar, Badge, Chip } from "@heroui/react"

import { getMediaUrl } from "@/utils/media"
import OouiUserAvatar from "~icons/ooui/user-avatar"

import ParentsAvatarGroup from "./ParentsAvatarGroup"
import StudentActionsDropdown from "./StudentActionsDropdown"

import type { Student } from "../../types"

export function renderCell(student: Student, columnKey: React.Key, roomId: string) {
	switch (columnKey) {
		case "student":
			return (
				<div className="flex items-center gap-3">
					<Badge.Anchor>
						<Avatar size="sm">
							<Avatar.Image
								src={
									student.avatar && student.avatar !== "/assets/avatars/default.jpg"
										? getMediaUrl(student.avatar)
										: undefined
								}
								alt={student.name}
							/>
							<Avatar.Fallback className="bg-accent text-white">
								<OouiUserAvatar className="size-5" />
							</Avatar.Fallback>
						</Avatar>
						<Badge
							color={student.checkedIn ? "success" : "danger"}
							className="h-3! w-3! min-h-0! min-w-0! border-2 border-white"
							placement="bottom-right"
						/>
					</Badge.Anchor>
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
