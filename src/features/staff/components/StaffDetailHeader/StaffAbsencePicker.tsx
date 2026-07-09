import { Button, Chip, Label, ListBox, Popover, RangeCalendar, Select } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { ABSENCE_REASONS } from "@/features/rooms/constants"
import SolarCalendarBroken from "~icons/solar/calendar-broken"

interface StaffAbsencePickerProps {
	absenceDate: string
}

const StaffAbsencePicker = ({ absenceDate }: StaffAbsencePickerProps) => {
	const { t } = useTranslation()

	return (
		<div className="flex items-center gap-3">
			<span className="shrink-0">{t("staff.detail.absenceDate")}</span>
			<Chip
				className="bg-[#792C410D] px-3 py-1 font-medium text-sm"
				style={{ color: "var(--colors-base-secondary, #7828C8)" }}
				variant="soft"
			>
				{absenceDate}
			</Chip>
			<Popover>
				<Popover.Trigger>
					<Button aria-label={t("staff.detail.setAbsenceDates")} isIconOnly size="sm" variant="primary">
						<SolarCalendarBroken className="size-4" />
					</Button>
				</Popover.Trigger>
				<Popover.Content>
					<Popover.Dialog>
						<div className="flex flex-col gap-4">
							<Select defaultValue="vacation" variant="secondary">
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
							<RangeCalendar aria-label={t("rooms.markAbsent.dateRangeAria")}>
								<RangeCalendar.Header>
									<RangeCalendar.Heading />
									<RangeCalendar.NavButton slot="previous" />
									<RangeCalendar.NavButton slot="next" />
								</RangeCalendar.Header>
								<RangeCalendar.Grid>
									<RangeCalendar.GridHeader>
										{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
									</RangeCalendar.GridHeader>
									<RangeCalendar.GridBody>{(date) => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody>
								</RangeCalendar.Grid>
							</RangeCalendar>
						</div>
					</Popover.Dialog>
				</Popover.Content>
			</Popover>
		</div>
	)
}

export default StaffAbsencePicker
