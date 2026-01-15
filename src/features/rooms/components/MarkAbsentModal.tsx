import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	RangeCalendar,
	Select,
	SelectItem,
	addToast,
} from "@heroui/react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useAtomValue } from "jotai"
import { useState } from "react"

import SolarCalendarBroken from "~icons/solar/calendar-broken"

import { ABSENCE_REASONS } from "../constants"
import { useMarkStudentAbsent } from "../hooks/useRooms"
import { closeMarkAbsentModal, markAbsentModalAtom } from "../stores/markAbsentModal.store"

import type { RangeValue } from "@heroui/react"
import type { CalendarDate } from "@internationalized/date"

const MarkAbsentModal = () => {
	const { isOpen, studentId, studentName } = useAtomValue(markAbsentModalAtom)
	const markAbsentMutation = useMarkStudentAbsent()

	const todayDate = today(getLocalTimeZone())
	const [dateRange, setDateRange] = useState<RangeValue<CalendarDate>>({
		start: todayDate,
		end: todayDate,
	})
	const [reason, setReason] = useState<string>("")

	const handleSubmit = () => {
		if (!studentId || !reason || !dateRange.start || !dateRange.end) return

		markAbsentMutation.mutate(
			{
				studentId,
				payload: {
					dateFrom: dateRange.start.toString(),
					dateTo: dateRange.end.toString(),
					reason,
				},
			},
			{
				onSuccess: () => {
					addToast({
						title: `${studentName} marked as absent`,
						color: "success",
					})
					handleClose()
				},
				onError: () => {
					addToast({
						title: "Failed to mark absent",
						description: "Please try again.",
						color: "danger",
					})
				},
			},
		)
	}

	const handleClose = () => {
		if (!markAbsentMutation.isPending) {
			markAbsentMutation.reset()
			setReason("")
			setDateRange({ start: todayDate, end: todayDate })
			closeMarkAbsentModal()
		}
	}

	const isFormValid = reason && dateRange.start && dateRange.end

	return (
		<Modal
			classNames={{ closeButton: "cursor-pointer" }}
			isOpen={isOpen}
			onOpenChange={(open) => !open && handleClose()}
			placement="center"
			size="sm"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col items-center gap-2 pb-0">
					<div className="flex size-12 items-center justify-center rounded-full bg-primary-100">
						<SolarCalendarBroken className="size-6 text-primary" />
					</div>
					<span className="font-semibold text-lg">Mark Absent</span>
					<span className="font-normal text-default-500 text-sm">{studentName}</span>
				</ModalHeader>
				<ModalBody className="gap-4 py-4">
					<Select
						label="Reason"
						placeholder="Select absence reason"
						selectedKeys={reason ? [reason] : []}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0]
							if (selected) setReason(String(selected))
						}}
						isRequired
					>
						{ABSENCE_REASONS.map((item) => (
							<SelectItem key={item.key}>{item.label}</SelectItem>
						))}
					</Select>
					<div className="flex flex-col gap-2">
						<span className="text-default-700 text-sm">Date Range</span>
						<RangeCalendar
							aria-label="Absence date range"
							value={dateRange}
							onChange={setDateRange}
							minValue={todayDate}
							classNames={{
								base: "w-full",
								gridWrapper: "w-full",
							}}
						/>
					</div>
				</ModalBody>
				<ModalFooter className="flex-col gap-2">
					<Button
						color="primary"
						fullWidth
						isLoading={markAbsentMutation.isPending}
						isDisabled={!isFormValid}
						onPress={handleSubmit}
						size="lg"
					>
						Confirm
					</Button>
					<Button color="default" fullWidth isDisabled={markAbsentMutation.isPending} onPress={handleClose} size="lg">
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default MarkAbsentModal
