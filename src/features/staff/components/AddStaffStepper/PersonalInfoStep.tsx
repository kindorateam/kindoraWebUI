import { DateField, FieldError, Input, Label, ListBox, Select, TextArea, TextField } from "@heroui/react"
import { parseDate } from "@internationalized/date"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import LucideUserRound from "~icons/lucide/user-round"

import { US_STATES } from "../../constants"

import type { DateValue } from "@internationalized/date"
import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const PersonalInfoStep = () => {
	const { t } = useTranslation()
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	const handleDateChange = (value: DateValue | null, onChange: (value: string | undefined) => void) => {
		if (value) {
			onChange(value.toString())
		} else {
			onChange(undefined)
		}
	}

	const parseDateValue = (value: string | undefined): DateValue | null => {
		if (!value) return null
		try {
			return parseDate(value)
		} catch {
			return null
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-xl">{t("staff.addStaff.title")}</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<LucideUserRound className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">{t("staff.profile.sections.personalInfo")}</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="phone"
					render={({ field }) => (
						<TextField isInvalid={!!errors.phone} variant="secondary">
							<Label>{t("staff.profile.fields.phone")}</Label>

							<Input {...field} placeholder={t("staff.addStaff.placeholders.phone")} type="tel" />

							<FieldError>{errors.phone?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="birthday"
					render={({ field }) => (
						<DateField
							granularity="day"
							isInvalid={!!errors.birthday}
							onChange={(value) => handleDateChange(value, field.onChange)}
							value={parseDateValue(field.value)}
						>
							<Label>{t("staff.profile.fields.birthday")}</Label>
							<DateField.Group variant="secondary">
								<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
							</DateField.Group>
							<FieldError>{errors.birthday?.message}</FieldError>
						</DateField>
					)}
				/>
				<Controller
					control={control}
					name="enrollDate"
					render={({ field }) => (
						<DateField
							granularity="day"
							isInvalid={!!errors.enrollDate}
							onChange={(value) => handleDateChange(value, field.onChange)}
							value={parseDateValue(field.value)}
						>
							<Label>{t("staff.profile.fields.enrollDate")}</Label>
							<DateField.Group variant="secondary">
								<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
							</DateField.Group>
							<FieldError>{errors.enrollDate?.message}</FieldError>
						</DateField>
					)}
				/>
				<Controller
					control={control}
					name="state"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.state}
							onSelectionChange={(key) => {
								if (key !== undefined) {
									field.onChange(String(key))
								}
							}}
							selectedKey={field.value ?? null}
							variant="secondary"
						>
							<Label>{t("staff.profile.fields.state")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{US_STATES.map((state) => (
										<ListBox.Item id={state.key} key={state.key} textValue={state.label}>
											{state.label}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							<FieldError>{errors.state?.message}</FieldError>
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="city"
					render={({ field }) => (
						<TextField isInvalid={!!errors.city} variant="secondary">
							<Label>{t("staff.profile.fields.city")}</Label>

							<Input {...field} placeholder={t("staff.addStaff.placeholders.city")} />

							<FieldError>{errors.city?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="streetAddress"
					render={({ field }) => (
						<TextField isInvalid={!!errors.streetAddress} variant="secondary">
							<Label>{t("staff.profile.fields.streetAddress")}</Label>

							<Input {...field} placeholder={t("staff.addStaff.placeholders.streetAddress")} />

							<FieldError>{errors.streetAddress?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="zipCode"
					render={({ field }) => (
						<TextField isInvalid={!!errors.zipCode} variant="secondary">
							<Label>{t("staff.profile.fields.zipCode")}</Label>

							<Input {...field} placeholder={t("staff.addStaff.placeholders.zipCode")} />

							<FieldError>{errors.zipCode?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<TextField isInvalid={!!errors.notes} variant="secondary">
							<Label>{t("staff.profile.fields.notes")}</Label>
							<TextArea {...field} placeholder={t("staff.addStaff.placeholders.notes")} />
							<FieldError>{errors.notes?.message}</FieldError>
						</TextField>
					)}
				/>
			</div>
		</div>
	)
}

export default PersonalInfoStep
