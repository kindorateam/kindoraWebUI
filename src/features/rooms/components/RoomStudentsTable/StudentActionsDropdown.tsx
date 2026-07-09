import { Button, Dropdown, toast } from "@heroui/react"
import { useTranslation } from "react-i18next"

import PhCheckCircleBold from "~icons/ph/check-circle-bold"
import PhSignOutBold from "~icons/ph/sign-out-bold"
import SolarCalendarBroken from "~icons/solar/calendar-broken"
import TablerDotsVertical from "~icons/tabler/dots-vertical"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"

import { useCheckInStudent, useCheckOutStudent } from "../../hooks/useRooms"
import { openMarkAbsentModal } from "../../stores/markAbsentModal.store"

import type { Student } from "../../types"

interface Props {
	student: Student
	roomId: string
}

const StudentActionsDropdown = ({ student, roomId }: Props) => {
	const { t } = useTranslation()
	const checkInMutation = useCheckInStudent()
	const checkOutMutation = useCheckOutStudent()

	const isLoading = checkInMutation.isPending || checkOutMutation.isPending

	const handleCheckAction = () => {
		const isCheckingOut = student.checkedIn

		const mutation = isCheckingOut ? checkOutMutation : checkInMutation

		mutation.mutate(
			{ roomId, studentId: student.id },
			{
				onSuccess: () => {
					toast.success(
						t(
							isCheckingOut
								? "rooms.studentsTable.actions.checkedOutSuccess"
								: "rooms.studentsTable.actions.checkedInSuccess",
							{
								name: student.name,
							},
						),
					)
				},
				onError: () => {
					toast.danger(
						t(
							isCheckingOut ? "rooms.studentsTable.actions.checkOutError" : "rooms.studentsTable.actions.checkInError",
							{
								name: student.name,
							},
						),
					)
				},
			},
		)
	}

	return (
		<div className="flex justify-center">
			<Dropdown>
				<Button
					isIconOnly
					isPending={isLoading}
					variant="ghost"
					aria-label={t("rooms.studentsTable.actions.ariaLabel")}
				>
					<TablerDotsVertical aria-hidden className="size-5 text-gray-600" />
				</Button>
				<Dropdown.Popover>
					<Dropdown.Menu aria-label={t("rooms.studentsTable.actions.ariaLabel")}>
						<Dropdown.Item id="view" textValue={t("rooms.studentsTable.actions.view")}>
							<TablerEye aria-hidden className="size-4 text-success" />
							{t("rooms.studentsTable.actions.view")}
						</Dropdown.Item>
						<Dropdown.Item id="edit" textValue={t("rooms.studentsTable.actions.edit")}>
							<TablerEdit aria-hidden className="size-4 text-warning" />
							{t("rooms.studentsTable.actions.edit")}
						</Dropdown.Item>
						<Dropdown.Item
							id="check"
							textValue={t(
								student.checkedIn ? "rooms.studentsTable.actions.checkOut" : "rooms.studentsTable.actions.checkIn",
							)}
							onAction={handleCheckAction}
						>
							{student.checkedIn ? (
								<PhSignOutBold aria-hidden className="size-4 text-accent" />
							) : (
								<PhCheckCircleBold aria-hidden className="size-4 text-accent" />
							)}
							{t(student.checkedIn ? "rooms.studentsTable.actions.checkOut" : "rooms.studentsTable.actions.checkIn")}
						</Dropdown.Item>
						<Dropdown.Item
							id="absent"
							textValue={t("rooms.studentsTable.actions.markAbsent")}
							onAction={() => openMarkAbsentModal(student.id, student.name)}
						>
							<SolarCalendarBroken aria-hidden className="size-4 text-foreground" />
							{t("rooms.studentsTable.actions.markAbsent")}
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>
		</div>
	)
}

export default StudentActionsDropdown
