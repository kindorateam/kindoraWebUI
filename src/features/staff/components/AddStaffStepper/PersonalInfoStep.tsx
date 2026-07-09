import { DateField, FieldError, Input, Label, ListBox, Select, TextArea, TextField } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { parseDateValue, serializeDateValue } from "@/utils/date"
import LucideUserRound from "~icons/lucide/user-round"

import { US_STATES } from "../../constants"

import AddStaffStepHeader from "./AddStaffStepHeader"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const PersonalInfoStep = () => {
	const { t } = useTranslation()
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	return (
		<div className="flex flex-col gap-6">
			<AddStaffStepHeader
				icon={<LucideUserRound className="size-5 text-foreground" />}
				title={t("staff.profile.sections.personalInfo")}
			/>

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
							onChange={(value) => field.onChange(serializeDateValue(value))}
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
