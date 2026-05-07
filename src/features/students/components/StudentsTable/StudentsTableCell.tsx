import { Avatar, Badge, Button, Chip, Dropdown, ListBox, Tooltip } from "@heroui/react"
import { useTranslation } from "react-i18next"

import IdentityChip from "@/components/IdentityChip"
import FluentPerson16Filled from "~icons/fluent/person-16-filled"
import MageHospitalPlusFill from "~icons/mage/hospital-plus-fill"
import TablerCalendarX from "~icons/tabler/calendar-x"
import TablerDotsVertical from "~icons/tabler/dots-vertical"
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
		<Badge.Anchor>
			<Avatar size="sm">
				<Avatar.Image src={student.avatar?.path} alt={`${student.firstName[0]}${student.lastName[0]}`} />
				<Avatar.Fallback className="bg-accent text-white">
					<FluentPerson16Filled className="size-6 text-white" />
				</Avatar.Fallback>
			</Avatar>
			{student.checkedIn && (
				<Badge
					color="success"
					placement="bottom-right"
					size="sm"
					className="h-3! min-h-0! w-3! min-w-0! border-2 border-white"
				/>
			)}
			{hasMedicalIssue && (
				<Badge className="border-none bg-transparent shadow-none" placement="top-left" size="sm">
					<MageHospitalPlusFill className="text-danger" />
				</Badge>
			)}
		</Badge.Anchor>
	)
}

const StudentsTableCell = ({ student, columnKey, onStudentClick }: StudentsTableCellProps) => {
	const { t } = useTranslation()
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
				<IdentityChip fallbackIcon="room" fullName={student.room.title} />
			) : (
				<span className="text-default-400 text-sm">—</span>
			)

		case "tags": {
			const tags = student.tags ?? []
			const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)
			const hiddenTags = tags.slice(MAX_VISIBLE_TAGS)
			const hiddenTagRows = Array.from({ length: Math.ceil(hiddenTags.length / 3) }, (_, index) =>
				hiddenTags.slice(index * 3, index * 3 + 3),
			)

			return (
				<div className="flex items-center gap-1">
					{visibleTags.map((tag) => (
						<Chip key={tag}>{tag}</Chip>
					))}
					{hiddenTags.length > 0 && (
						<Tooltip delay={0}>
							<Tooltip.Trigger
								aria-label={t("students.table.moreTags", { count: hiddenTags.length })}
								className="cursor-pointer"
							>
								<Chip size="sm">+{hiddenTags.length}</Chip>
							</Tooltip.Trigger>
							<Tooltip.Content className="flex flex-col gap-1">
								{hiddenTagRows.map((row) => (
									<div className="flex gap-1" key={row.join("|")}>
										{row.map((tag) => (
											<Chip key={tag} size="sm">
												{tag}
											</Chip>
										))}
									</div>
								))}
							</Tooltip.Content>
						</Tooltip>
					)}
				</div>
			)
		}

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Button isIconOnly size="sm" variant="ghost" aria-label={t("students.table.actions.ariaLabel")}>
							<TablerDotsVertical aria-hidden className="size-5 text-default-400" />
						</Button>
						<Dropdown.Popover className="min-w-0">
							<Dropdown.Menu aria-label={t("students.table.actions.ariaLabel")}>
								<Dropdown.Item id="view" textValue={t("students.table.actions.view")} className="text-success">
									<ListBox.ItemIndicator />
									<TablerEye aria-hidden className="size-5" />
									<span>{t("students.table.actions.view")}</span>
								</Dropdown.Item>
								<Dropdown.Item id="edit" textValue={t("students.table.actions.edit")} className="text-warning">
									<ListBox.ItemIndicator />
									<TablerEdit aria-hidden className="size-5" />
									<span>{t("students.table.actions.edit")}</span>
								</Dropdown.Item>
								<Dropdown.Item id="sign-in-out" textValue={t("students.table.actions.signInOut")}>
									<ListBox.ItemIndicator />
									<TablerLogin aria-hidden className="size-5" />
									<span>{t("students.table.actions.signInOut")}</span>
								</Dropdown.Item>
								<Dropdown.Item id="mark-absent" textValue={t("students.table.actions.markAbsent")}>
									<ListBox.ItemIndicator />
									<TablerCalendarX aria-hidden className="size-5" />
									<span>{t("students.table.actions.markAbsent")}</span>
								</Dropdown.Item>
								<Dropdown.Item id="delete" textValue={t("students.table.actions.delete")} className="text-danger">
									<ListBox.ItemIndicator />
									<TablerTrash aria-hidden className="size-5" />
									<span>{t("students.table.actions.delete")}</span>
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
