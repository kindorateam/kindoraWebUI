import { Avatar, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@heroui/react"

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
}

const StudentsTableCell = ({ student, columnKey }: StudentsTableCellProps) => {
	switch (columnKey) {
		case "name":
			return (
				<div className="flex items-center gap-2">
					<Avatar
						className="shrink-0"
						classNames={{ base: "bg-primary" }}
						name={`${student.firstName[0]}${student.lastName[0]}`}
						showFallback
						size="sm"
						src={student.avatar}
					/>
					<span className="text-sm">
						{student.firstName} {student.lastName}
					</span>
				</div>
			)

		case "parents":
			return <ParentsAvatarGroup parents={student.parents} />

		case "room":
			return student.roomName ? (
				<Chip
					avatar={<Avatar classNames={{ base: "bg-default-300" }} name={student.roomIcon} size="sm" />}
					classNames={{ base: "bg-primary-50", content: "text-sm" }}
					size="sm"
					variant="flat"
				>
					{student.roomName}
				</Chip>
			) : (
				<span className="text-default-400 text-sm">—</span>
			)

		case "tags": {
			const visibleTags = student.tags.slice(0, MAX_VISIBLE_TAGS)
			const hiddenTags = student.tags.slice(MAX_VISIBLE_TAGS)

			return (
				<div className="flex items-center gap-1">
					{visibleTags.map((tag) => (
						<Chip classNames={{ base: "bg-default-100", content: "text-sm" }} key={tag} size="sm" variant="flat">
							{tag}
						</Chip>
					))}
					{hiddenTags.length > 0 && (
						<Tooltip content={hiddenTags.join(", ")}>
							<Chip classNames={{ base: "bg-default-100 cursor-pointer", content: "text-sm" }} size="sm" variant="flat">
								+{hiddenTags.length}
							</Chip>
						</Tooltip>
					)}
				</div>
			)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown classNames={{ content: "min-w-0" }}>
						<DropdownTrigger>
							<Button isIconOnly radius="md" size="sm" variant="light">
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
						</DropdownTrigger>
						<DropdownMenu aria-label="Student actions">
							<DropdownItem
								key="view"
								className="text-success"
								startContent={<TablerEye aria-hidden className="size-5" />}
							>
								View
							</DropdownItem>
							<DropdownItem
								key="edit"
								className="text-warning"
								startContent={<TablerEdit aria-hidden className="size-5" />}
							>
								Edit
							</DropdownItem>
							<DropdownItem key="sign-in-out" startContent={<TablerLogin aria-hidden className="size-5" />}>
								Sign In/Out
							</DropdownItem>
							<DropdownItem key="mark-absent" startContent={<TablerCalendarX aria-hidden className="size-5" />}>
								Mark absent
							</DropdownItem>
							<DropdownItem
								key="delete"
								className="text-danger"
								startContent={<TablerTrash aria-hidden className="size-5" />}
							>
								Delete
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}

export default StudentsTableCell
