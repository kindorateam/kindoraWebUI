import { Button, Label, ListBox, Modal, RangeCalendar, Select, toast } from "@heroui/react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useAtomValue } from "jotai"
import { useState } from "react"

import { getErrorMessage } from "@/utils/error"
import SolarCalendarBroken from "~icons/solar/calendar-broken"

import { ABSENCE_REASONS } from "../constants"
import { useMarkStudentAbsent } from "../hooks/useRooms"
import { closeMarkAbsentModal, markAbsentModalAtom } from "../stores/markAbsentModal.store"

import type { CalendarDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

/**
 * Converts CalendarDate to RFC3339 timestamp string
 */
const toRFC3339 = (date: CalendarDate): string => {
	return date.toDate(getLocalTimeZone()).toISOString()
}

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
					dateFrom: toRFC3339(dateRange.start),
					dateTo: toRFC3339(dateRange.end),
					reason,
				},
			},
			{
				onSuccess: () => {
					toast(`${studentName} marked as absent`, { variant: "success" })
					handleClose()
				},
				onError: (error) => {
					toast("Failed to mark absent", {
						description: getErrorMessage(error),
						variant: "danger",
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
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<div className="flex flex-col items-center gap-2 pb-0">
							<div className="flex size-12 items-center justify-center rounded-full bg-primary-100">
								<SolarCalendarBroken className="size-6 text-primary" />
							</div>
							<Modal.Heading>Mark Absent</Modal.Heading>
							<span className="font-normal text-default-500 text-sm">{studentName}</span>
						</div>
					</Modal.Header>
					<Modal.Body className="gap-4">
						<Select
							isRequired
							selectedKey={reason || null}
							onSelectionChange={(key) => {
								if (key !== null) setReason(String(key))
							}}
						>
							<Label>Reason</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{ABSENCE_REASONS.map((item) => (
										<ListBox.Item id={item.key} key={item.key} textValue={item.label}>
											{item.label}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>
						<div className="flex flex-col gap-2">
							<span className="text-default-700 text-sm">Date Range</span>
							<RangeCalendar
								aria-label="Absence date range"
								className="w-full"
								minValue={todayDate}
								onChange={setDateRange}
								value={dateRange}
							/>
						</div>
					</Modal.Body>
					<Modal.Footer className="flex-col gap-2">
						<Button
							variant="primary"
							fullWidth
							isDisabled={!isFormValid}
							isPending={markAbsentMutation.isPending}
							onPress={handleSubmit}
							size="md"
						>
							Confirm
						</Button>
						<Button fullWidth isDisabled={markAbsentMutation.isPending} onPress={handleClose} size="md">
							Cancel
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default MarkAbsentModal
