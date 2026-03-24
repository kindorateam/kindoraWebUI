import { Avatar, Badge, Button, Chip, Separator } from "@heroui/react"

import IdentityChip from "@/components/IdentityChip"
import SolarCalendarBroken from "~icons/solar/calendar-broken"

import type { Student } from "../../types"

interface StudentDetailHeaderProps {
	student: Student
	onMoveToRoom?: () => void
	onScheduleAbsence?: () => void
}

const formatAbsenceDate = (student: Student) => {
	if (!student.absence) return "Not scheduled"
	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
	})

	return `${dateFormatter.format(new Date(student.absence.dateFrom))} - ${dateFormatter.format(new Date(student.absence.dateTo))}`
}

const StudentDetailHeader = ({ student, onMoveToRoom, onScheduleAbsence }: StudentDetailHeaderProps) => {
	const studentName = `${student.firstName} ${student.lastName}`

	return (
		<div className="container mx-auto max-w-4xl">
			<div className="mb-7 flex items-start gap-10">
				<Badge.Anchor>
					<Avatar className="size-25 shrink-0 border-4 border-white shadow-md">
						<Avatar.Image src={student.avatar?.path} alt={studentName} />
						<Avatar.Fallback>{`${student.firstName[0]}${student.lastName[0]}`}</Avatar.Fallback>
					</Avatar>
					<Badge color={student.checkedIn ? "success" : "danger"} placement="bottom-right" />
				</Badge.Anchor>

				<div className="flex min-w-0 flex-1 flex-col gap-6 pt-1">
					<div className="flex flex-col gap-2">
						<h1 className="font-semibold text-4xl leading-none">{studentName}</h1>
						<Separator />
					</div>

					<div className="flex items-center gap-6">
						<div className="flex items-center gap-4">
							<span className="text-neutral-600 text-sm">Rooms</span>
							<IdentityChip fullName={student.room?.title ?? "Unassigned"} />
						</div>

						<Button
							className="ml-auto shadow-sm"
							isDisabled={!onMoveToRoom}
							onPress={onMoveToRoom}
							size="md"
							variant="outline"
						>
							Move to another room
						</Button>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-neutral-600 text-sm">Schedule absence</span>
						<Button variant="primary" isDisabled={!onScheduleAbsence} isIconOnly onPress={onScheduleAbsence} size="sm">
							<SolarCalendarBroken className="size-4 text-white" />
						</Button>

						<div className="flex items-center gap-3">
							<span className="text-neutral-600 text-sm">Absence date</span>
							<Chip className="bg-secondary-100/80" size="sm">
								<span className="text-secondary-600 text-sm">{formatAbsenceDate(student)}</span>
							</Chip>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StudentDetailHeader
