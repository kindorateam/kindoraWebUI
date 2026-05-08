import { FieldError, Label, ListBox, Select } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import SolarCalendarBroken from "~icons/solar/calendar-broken"

import { WORKING_DAYS } from "../../constants"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const ScheduleStep = () => {
	const { t } = useTranslation()
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-xl">{t("staff.addStaff.title")}</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<SolarCalendarBroken className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">{t("staff.profile.sections.schedule")}</span>
				</div>
			</div>

			<Controller
				control={control}
				name="workingDays"
				render={({ field }) => (
					<Select
						isInvalid={!!errors.workingDays}
						onChange={(keys) => {
							const selected = (keys as string[]).slice()
							selected.sort(
								(a, b) => WORKING_DAYS.findIndex((d) => d.key === a) - WORKING_DAYS.findIndex((d) => d.key === b),
							)
							field.onChange(selected)
						}}
						value={field.value || []}
						selectionMode="multiple"
						variant="secondary"
					>
						<Label>{t("staff.profile.fields.workingDays")}</Label>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{WORKING_DAYS.map((day) => (
									<ListBox.Item id={day.key} key={day.key} textValue={t(day.labelKey)}>
										{t(day.labelKey)}
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
						<FieldError>{errors.workingDays?.message}</FieldError>
					</Select>
				)}
			/>
		</div>
	)
}

export default ScheduleStep
