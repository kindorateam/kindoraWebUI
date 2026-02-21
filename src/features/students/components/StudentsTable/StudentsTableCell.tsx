import {
	Avatar,
	Badge,
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Tooltip,
} from "@heroui/react"

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

const StudentsTableCell = ({ student, columnKey, onStudentClick }: StudentsTableCellProps) => {
	const fullName = `${student.firstName} ${student.lastName}`

	switch (columnKey) {
		case "name": {
			const hasMedicalIssue =
				student.tags?.some((tag) => tag.toLowerCase().includes("allergy") || tag.toLowerCase().includes("medical")) ??
				false

			return onStudentClick ? (
				<button
					className="flex cursor-pointer items-center gap-3 text-left"
					onClick={() => onStudentClick(student.id)}
					type="button"
				>
					<div className="relative">
						<Badge
							isDot
							color="success"
							shape="circle"
							placement="bottom-right"
							isInvisible={!student.checkedIn}
							classNames={{ badge: "size-3 border-2 border-white" }}
						>
							<Badge
								isOneChar
								content={<TablerAsterisk className="size-3.5 text-danger [&_path]:stroke-3" />}
								isInvisible={!hasMedicalIssue}
								placement="top-left"
								shape="circle"
								classNames={{ badge: "bg-transparent border-0 p-0" }}
							>
								<Avatar
									className="shrink-0"
									classNames={{ base: "bg-primary text-white" }}
									name={`${student.firstName[0]}${student.lastName[0]}`}
									showFallback
									size="sm"
									src={student.avatar?.path}
								/>
							</Badge>
						</Badge>
					</div>
					<span className="text-default-foreground text-sm">{fullName}</span>
				</button>
			) : (
				<div className="flex items-center gap-3">
					<div className="relative">
						<Badge
							isDot
							color="success"
							shape="circle"
							placement="bottom-right"
							isInvisible={!student.checkedIn}
							classNames={{ badge: "size-3 border-2 border-white" }}
						>
							<Badge
								isOneChar
								content={<TablerAsterisk className="size-3.5 text-danger [&_path]:stroke-3" />}
								isInvisible={!hasMedicalIssue}
								placement="top-left"
								shape="circle"
								classNames={{ badge: "bg-transparent border-0 p-0" }}
							>
								<Avatar
									className="shrink-0"
									classNames={{ base: "bg-primary text-white" }}
									name={`${student.firstName[0]}${student.lastName[0]}`}
									showFallback
									size="sm"
									src={student.avatar?.path}
								/>
							</Badge>
						</Badge>
					</div>
					<span className="text-default-foreground text-sm">{fullName}</span>
				</div>
			)
		}

		case "parents":
			return <ParentsAvatarGroup parents={student.parents ?? []} />

		case "room":
			return student.room ? (
				<Chip
					classNames={{ base: "bg-primary-50 px-3", content: "text-sm text-default-foreground px-1 font-regular" }}
					size="sm"
					variant="flat"
					startContent={
						<Avatar
							classNames={{ base: "size-5 bg-default-300 text-[10px] text-default-700" }}
							name={student.room.title[0]}
						/>
					}
				>
					{student.room.title}
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
