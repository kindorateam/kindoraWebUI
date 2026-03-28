import { Button, Dropdown, toast } from "@heroui/react"

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
	const checkInMutation = useCheckInStudent()
	const checkOutMutation = useCheckOutStudent()

	const isLoading = checkInMutation.isPending || checkOutMutation.isPending

	const handleCheckAction = () => {
		const isCheckingOut = student.checkedIn
		const action = isCheckingOut ? "checked out" : "checked in"

		const mutation = isCheckingOut ? checkOutMutation : checkInMutation

		mutation.mutate(
			{ roomId, studentId: student.id },
			{
				onSuccess: () => {
					toast.success(`${student.name} ${action}`)
				},
				onError: () => {
					toast.danger(`Failed to ${isCheckingOut ? "check out" : "check in"} ${student.name}. Please try again.`)
				},
			},
		)
	}

	return (
		<div className="flex justify-center">
			<Dropdown>
				<Button isIconOnly isPending={isLoading} variant="ghost" aria-label="Student actions">
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
					<Dropdown.Menu aria-label="Student actions">
						<Dropdown.Item id="view" textValue="View">
							<TablerEye aria-hidden className="size-4 text-success" />
							View
						</Dropdown.Item>
						<Dropdown.Item id="edit" textValue="Edit">
							<TablerEdit aria-hidden className="size-4 text-warning" />
							Edit
						</Dropdown.Item>
						<Dropdown.Item
							id="check"
							textValue={student.checkedIn ? "Check out" : "Check in"}
							onAction={handleCheckAction}
						>
							{student.checkedIn ? (
								<PhSignOutBold aria-hidden className="size-4 text-accent" />
							) : (
								<PhCheckCircleBold aria-hidden className="size-4 text-accent" />
							)}
							{student.checkedIn ? "Check out" : "Check in"}
						</Dropdown.Item>
						<Dropdown.Item
							id="absent"
							textValue="Mark absent"
							onAction={() => openMarkAbsentModal(student.id, student.name)}
						>
							<SolarCalendarBroken aria-hidden className="size-4 text-foreground" />
							Mark absent
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>
		</div>
	)
}

export default StudentActionsDropdown
