import { FieldError, Input, Label, ListBox, Select, TextField } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import StreamlineUltimateEmergencyCall from "~icons/streamline-ultimate/emergency-call"

import { RELATIONSHIP_OPTIONS } from "../../constants"

import AddStaffStepHeader from "./AddStaffStepHeader"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const EmergencyContactStep = () => {
	const { t } = useTranslation()
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	return (
		<div className="flex flex-col gap-6">
			<AddStaffStepHeader
				icon={<StreamlineUltimateEmergencyCall className="size-5 text-foreground" />}
				title={t("staff.profile.sections.emergencyContact")}
			/>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="emergencyContactName"
					render={({ field }) => (
						<TextField isInvalid={!!errors.emergencyContactName} variant="secondary">
							<Label>{t("staff.profile.fields.name")}</Label>

							<Input {...field} value={field.value || ""} />

							<FieldError>{errors.emergencyContactName?.message}</FieldError>
						</TextField>
					)}
				/>

				<Controller
					control={control}
					name="emergencyContactPhone"
					render={({ field }) => (
						<TextField isInvalid={!!errors.emergencyContactPhone} variant="secondary">
							<Label>{t("staff.profile.fields.phone")}</Label>

							<Input {...field} value={field.value || ""} />

							<FieldError>{errors.emergencyContactPhone?.message}</FieldError>
						</TextField>
					)}
				/>

				<Controller
					control={control}
					name="emergencyContactRelationship"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.emergencyContactRelationship}
							onSelectionChange={(key) => {
								if (key !== undefined) {
									field.onChange(String(key))
								}
							}}
							selectedKey={field.value ?? null}
							variant="secondary"
						>
							<Label>{t("staff.profile.fields.relationshipToStaff")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{RELATIONSHIP_OPTIONS.map((option) => (
										<ListBox.Item id={option.key} key={option.key} textValue={t(option.labelKey)}>
											{t(option.labelKey)}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							<FieldError>{errors.emergencyContactRelationship?.message}</FieldError>
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default EmergencyContactStep
