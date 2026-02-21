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
	return `${student.absence.dateFrom} - ${student.absence.dateTo}`
}

const StudentDetailHeader = ({ student, onMoveToRoom, onScheduleAbsence }: StudentDetailHeaderProps) => {
	const studentName = `${student.firstName} ${student.lastName}`

	return (
		<div className="container mx-auto max-w-4xl">
			<div className="mb-7 flex items-start justify-between gap-10">
				<div className="flex items-start gap-10">
					<Badge
						color="success"
						shape="circle"
						placement="bottom-right"
						isInvisible={!student.checkedIn}
						classNames={{ badge: "size-6 border-2 border-white" }}
					>
						<Avatar
							className="size-25 shrink-0 border-4 border-white shadow-md"
							name={`${student.firstName[0]}${student.lastName[0]}`}
							showFallback
							src={student.avatar?.path}
						/>
					</Badge>

					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-1">
							<h1 className="font-semibold text-4xl">{studentName}</h1>
							<Divider />
						</div>

						<div className="flex items-center justify-between gap-8">
							<div className="flex items-center gap-7">
								<span className="text-neutral-600 text-sm">Rooms</span>
								<IdentityChip fullName={student.room?.title ?? "Unassigned"} />
							</div>

							<Button
								endContent={<MageExchangeA className="size-5" />}
								isDisabled={!onMoveToRoom}
								onPress={onMoveToRoom}
								radius="lg"
								variant="flat"
								className="bg-white text-sm shadow-md"
							>
								Move to another room
							</Button>
						</div>

						<div className="flex items-center gap-3">
							<span className="text-neutral-600 text-sm">Schedule absence</span>
							<Button isDisabled={!onScheduleAbsence} isIconOnly radius="full" onPress={onScheduleAbsence}>
								<SolarCalendarBroken className="size-5" />
							</Button>
							<Chip className="bg-secondary-100/80" classNames={{ content: "text-sm text-secondary-600" }} size="sm">
								{formatAbsenceDate(student)}
							</Chip>
						</div>

						{student.absence && <div className="text-default-500 text-sm">Reason: {student.absence.reason}</div>}
					</div>
				</div>
			</div>
		</div>
	)
}

export default StudentDetailHeader
