import { FieldError, Input, Label, ListBox, Select, TextField } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import TablerCertificate from "~icons/tabler/certificate"

import { DEGREE_OPTIONS } from "../../constants"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const CertificationStep = () => {
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
					<TablerCertificate className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">{t("staff.profile.sections.certification")}</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="degree"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.degree}
							onSelectionChange={(key) => {
								if (key !== undefined) {
									field.onChange(String(key))
								}
							}}
							selectedKey={field.value ?? null}
							variant="secondary"
						>
							<Label>{t("staff.profile.fields.degree")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{DEGREE_OPTIONS.map((degree) => (
										<ListBox.Item id={degree.key} key={degree.key} textValue={t(degree.labelKey)}>
											{t(degree.labelKey)}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							<FieldError>{errors.degree?.message}</FieldError>
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="certification"
					render={({ field }) => (
						<TextField isInvalid={!!errors.certification} variant="secondary">
							<Label>{t("staff.profile.fields.certification")}</Label>

							<Input {...field} placeholder={t("staff.addStaff.placeholders.certification")} />

							<FieldError>{errors.certification?.message}</FieldError>
						</TextField>
					)}
				/>
			</div>
		</div>
	)
}

export default CertificationStep
