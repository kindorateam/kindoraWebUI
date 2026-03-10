import { Avatar, Badge, Button, Chip, Divider } from "@heroui/react"

import IdentityChip from "@/components/IdentityChip"
import MageExchangeA from "~icons/mage/exchange-a"
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
				<Badge
					color={student.checkedIn ? "success" : "danger"}
					isInvisible={false}
					isOneChar
					placement="bottom-right"
					shape="circle"
				>
					<Avatar
						className="size-25 shrink-0 border-4 border-white shadow-md"
						name={`${student.firstName[0]}${student.lastName[0]}`}
						showFallback
						src={student.avatar?.path}
					/>
				</Badge>

				<div className="flex min-w-0 flex-1 flex-col gap-6 pt-1">
					<div className="flex flex-col gap-2">
						<h1 className="font-semibold text-4xl leading-none">{studentName}</h1>
						<Divider />
					</div>

					<div className="flex items-center gap-6">
						<div className="flex items-center gap-4">
							<span className="text-neutral-600 text-sm">Rooms</span>
							<IdentityChip fullName={student.room?.title ?? "Unassigned"} />
						</div>

						<Button
							className="ml-auto shadow-small"
							endContent={<MageExchangeA className="size-4" />}
							isDisabled={!onMoveToRoom}
							onPress={onMoveToRoom}
							radius="md"
							size="md"
							variant="bordered"
						>
							Move to another room
						</Button>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-neutral-600 text-sm">Schedule absence</span>
						<Button
							color="primary"
							isDisabled={!onScheduleAbsence}
							isIconOnly
							onPress={onScheduleAbsence}
							radius="md"
							size="sm"
						>
							<SolarCalendarBroken className="size-4 text-white" />
						</Button>

						<div className="flex items-center gap-3">
							<span className="text-neutral-600 text-sm">Absence date</span>
							<Chip className="bg-secondary-100/80" classNames={{ content: "text-sm text-secondary-600" }} size="sm">
								{formatAbsenceDate(student)}
							</Chip>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StudentDetailHeader
