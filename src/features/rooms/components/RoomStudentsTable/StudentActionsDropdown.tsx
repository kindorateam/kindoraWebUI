import { Button, Dropdown, toast } from "@heroui/react"
import { useTranslation } from "react-i18next"

import PhCheckCircleBold from "~icons/ph/check-circle-bold"
import PhSignOutBold from "~icons/ph/sign-out-bold"
import SolarCalendarBroken from "~icons/solar/calendar-broken"
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
					<svg
						aria-hidden="true"
						className="size-5 text-gray-600"
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
