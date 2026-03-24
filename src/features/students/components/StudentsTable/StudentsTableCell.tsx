import { Avatar, Button, Chip, Dropdown, ListBox, Tooltip } from "@heroui/react"

import TablerAsterisk from "~icons/tabler/asterisk"
import TablerCalendarX from "~icons/tabler/calendar-x"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"
import TablerLogin from "~icons/tabler/login"
import TablerTrash from "~icons/tabler/trash"

import ParentsAvatarGroup from "./ParentsAvatarGroup"

import type { Student } from "../../types"

const MAX_VISIBLE_TAGS = 3

interface StudentsTableCellProps {
	student: Student
	columnKey: React.Key
	onStudentClick?: (studentId: string) => void
}

const AvatarWithBadges = ({ student }: { student: Student }) => {
	const hasMedicalIssue =
		student.tags?.some((tag) => tag.toLowerCase().includes("allergy") || tag.toLowerCase().includes("medical")) ?? false

	return (
		<div className="relative">
			{student.checkedIn && (
				<span className="absolute right-0 bottom-0 z-10 size-3 rounded-full border-2 border-white bg-success" />
			)}
			{hasMedicalIssue && (
				<span className="absolute top-0 left-0 z-10 flex items-center justify-center">
					<TablerAsterisk className="size-3.5 text-danger [&_path]:stroke-3" />
				</span>
			)}
			<Avatar className="shrink-0 bg-primary text-white" size="sm">
				<Avatar.Image src={student.avatar?.path} alt={`${student.firstName[0]}${student.lastName[0]}`} />
				<Avatar.Fallback>{`${student.firstName[0]}${student.lastName[0]}`}</Avatar.Fallback>
			</Avatar>
		</div>
	)
}

const StudentsTableCell = ({ student, columnKey, onStudentClick }: StudentsTableCellProps) => {
	const fullName = `${student.firstName} ${student.lastName}`

	switch (columnKey) {
		case "name": {
			return onStudentClick ? (
				<button
					className="flex cursor-pointer items-center gap-3 text-left"
					onClick={() => onStudentClick(student.id)}
					type="button"
				>
					<AvatarWithBadges student={student} />
					<span className="text-default-foreground text-sm">{fullName}</span>
				</button>
			) : (
				<div className="flex items-center gap-3">
					<AvatarWithBadges student={student} />
					<span className="text-default-foreground text-sm">{fullName}</span>
				</div>
			)
		}

		case "parents":
			return <ParentsAvatarGroup parents={student.parents ?? []} />

		case "room":
			return student.room ? (
				<Chip className="bg-primary-50 px-3" size="sm" variant="soft">
					<Avatar className="size-5 bg-default-300 text-[10px] text-default-700">
						<Avatar.Fallback>{student.room.title[0]}</Avatar.Fallback>
					</Avatar>
					<span className="px-1 font-regular text-default-foreground text-sm">{student.room.title}</span>
				</Chip>
			) : (
				<span className="text-default-400 text-sm">—</span>
			)

		case "tags": {
			const tags = student.tags ?? []
			const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)
			const hiddenTags = tags.slice(MAX_VISIBLE_TAGS)

			return (
				<div className="flex items-center gap-1">
					{visibleTags.map((tag) => (
						<Chip className="bg-default-100" key={tag} size="sm" variant="soft">
							<span className="text-sm">{tag}</span>
						</Chip>
					))}
					{hiddenTags.length > 0 && (
						<Tooltip>
							<Chip className="cursor-pointer bg-default-100" size="sm" variant="soft">
								<span className="text-sm">+{hiddenTags.length}</span>
							</Chip>
							<Tooltip.Content>{hiddenTags.join(", ")}</Tooltip.Content>
						</Tooltip>
					)}
				</div>
			)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Dropdown.Trigger>
							<Button isIconOnly size="sm" variant="ghost">
								<svg
									aria-hidden="true"
									className="size-5 text-default-400"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									viewBox="0 0 24 24"
								>
									<circle cx={12} cy={12} r={1} />
									<circle cx={12} cy={5} r={1} />
									<circle cx={12} cy={19} r={1} />
								</svg>
							</Button>
						</Dropdown.Trigger>
						<Dropdown.Popover className="min-w-0">
							<Dropdown.Menu aria-label="Student actions">
								<Dropdown.Item id="view" textValue="View" className="text-success">
									<ListBox.ItemIndicator />
									<TablerEye aria-hidden className="size-5" />
									<span>View</span>
								</Dropdown.Item>
								<Dropdown.Item id="edit" textValue="Edit" className="text-warning">
									<ListBox.ItemIndicator />
									<TablerEdit aria-hidden className="size-5" />
									<span>Edit</span>
								</Dropdown.Item>
								<Dropdown.Item id="sign-in-out" textValue="Sign In/Out">
									<ListBox.ItemIndicator />
									<TablerLogin aria-hidden className="size-5" />
									<span>Sign In/Out</span>
								</Dropdown.Item>
								<Dropdown.Item id="mark-absent" textValue="Mark absent">
									<ListBox.ItemIndicator />
									<TablerCalendarX aria-hidden className="size-5" />
									<span>Mark absent</span>
								</Dropdown.Item>
								<Dropdown.Item id="delete" textValue="Delete" className="text-danger">
									<ListBox.ItemIndicator />
									<TablerTrash aria-hidden className="size-5" />
									<span>Delete</span>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown.Popover>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}

export default StudentsTableCell
