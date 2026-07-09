import { Button, Label, ListBox, Modal, RangeCalendar, Select, toast } from "@heroui/react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useCreateStudentAbsence } from "@/features/students/hooks/useStudents"
import { getErrorMessage } from "@/utils/error"
import SolarCalendarBroken from "~icons/solar/calendar-broken"

import { ABSENCE_REASONS } from "../constants"
import { closeMarkAbsentModal, markAbsentModalAtom } from "../stores/markAbsentModal.store"

import type { CalendarDate } from "@internationalized/date"

/**
 * Converts CalendarDate to RFC3339 timestamp string
 */
const toRFC3339 = (date: CalendarDate): string => {
	return date.toDate(getLocalTimeZone()).toISOString()
}

const MarkAbsentModal = () => {
	const { t } = useTranslation()
	const { isOpen, studentId, studentName } = useAtomValue(markAbsentModalAtom)
	const markAbsentMutation = useCreateStudentAbsence()

	const todayDate = today(getLocalTimeZone())
	const [dateRange, setDateRange] = useState<{ start: CalendarDate; end: CalendarDate }>({
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
					toast(t("rooms.markAbsent.success", { studentName }), { variant: "success" })
					handleClose()
				},
				onError: (error) => {
					toast(t("rooms.markAbsent.error"), {
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
							<Modal.Heading>{t("rooms.markAbsent.title")}</Modal.Heading>
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
							<Label>{t("rooms.markAbsent.reason")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{ABSENCE_REASONS.map((item) => (
										<ListBox.Item id={item.key} key={item.key} textValue={t(item.labelKey)}>
											{t(item.labelKey)}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>
						<div className="flex flex-col gap-2">
							<span className="text-default-700 text-sm">{t("rooms.markAbsent.dateRange")}</span>
							<RangeCalendar
								aria-label={t("rooms.markAbsent.dateRangeAria")}
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
							{t("common.confirm")}
						</Button>
						<Button fullWidth isDisabled={markAbsentMutation.isPending} onPress={handleClose} size="md">
							{t("common.cancel")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default MarkAbsentModal
