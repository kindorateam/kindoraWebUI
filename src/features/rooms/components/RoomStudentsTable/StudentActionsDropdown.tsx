import { Button, Dropdown, Label, toast } from "@heroui/react"

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
					toast.error(`Failed to ${isCheckingOut ? "check out" : "check in"} ${student.name}. Please try again.`)
				},
			},
		)
	}

	return (
		<div className="flex justify-center">
			<Dropdown>
				<Dropdown.Trigger>
					<Button isIconOnly isLoading={isLoading} radius="md" variant="light">
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
				</Dropdown.Trigger>
				<Dropdown.Popover>
					<Dropdown.Menu aria-label="Student actions">
						<Dropdown.Item id="view" textValue="View" className="text-success">
							<Label>
								<TablerEye aria-hidden className="size-5" />
								View
							</Label>
						</Dropdown.Item>
						<Dropdown.Item id="edit" textValue="Edit" className="text-warning">
							<Label>
								<TablerEdit aria-hidden className="size-5" />
								Edit
							</Label>
						</Dropdown.Item>
						<Dropdown.Item
							id="check"
							textValue={student.checkedIn ? "Check out" : "Check in"}
							className="text-primary"
							onAction={handleCheckAction}
						>
							<Label>
								{student.checkedIn ? (
									<PhSignOutBold aria-hidden className="size-5" />
								) : (
									<PhCheckCircleBold aria-hidden className="size-5" />
								)}
								{student.checkedIn ? "Check out" : "Check in"}
							</Label>
						</Dropdown.Item>
						<Dropdown.Item
							id="absent"
							textValue="Mark absent"
							onAction={() => openMarkAbsentModal(student.id, student.name)}
						>
							<Label>
								<SolarCalendarBroken aria-hidden className="size-5" />
								Mark absent
							</Label>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>
		</div>
	)
}

export default StudentActionsDropdown
