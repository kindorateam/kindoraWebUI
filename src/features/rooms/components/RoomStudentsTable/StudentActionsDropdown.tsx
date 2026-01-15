import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, addToast } from "@heroui/react"

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
					addToast({
						title: `${student.name} ${action}`,
						color: "success",
					})
				},
				onError: () => {
					addToast({
						title: "Action failed",
						description: `Failed to ${isCheckingOut ? "check out" : "check in"} ${student.name}. Please try again.`,
						color: "danger",
					})
				},
			},
		)
	}

	return (
		<div className="flex justify-center">
			<Dropdown classNames={{ content: "min-w-0" }}>
				<DropdownTrigger>
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
				</DropdownTrigger>
				<DropdownMenu aria-label="Student actions">
					<DropdownItem key="view" className="text-success" startContent={<TablerEye aria-hidden className="size-5" />}>
						View
					</DropdownItem>
					<DropdownItem
						key="edit"
						className="text-warning"
						startContent={<TablerEdit aria-hidden className="size-5" />}
					>
						Edit
					</DropdownItem>
					<DropdownItem
						key="check"
						className="text-primary"
						startContent={
							student.checkedIn ? (
								<PhSignOutBold aria-hidden className="size-5" />
							) : (
								<PhCheckCircleBold aria-hidden className="size-5" />
							)
						}
						onPress={handleCheckAction}
					>
						{student.checkedIn ? "Check out" : "Check in"}
					</DropdownItem>
					<DropdownItem
						key="absent"
						startContent={<SolarCalendarBroken aria-hidden className="size-5" />}
						onPress={() => openMarkAbsentModal(student.id, student.name)}
					>
						Mark absent
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	)
}

export default StudentActionsDropdown
