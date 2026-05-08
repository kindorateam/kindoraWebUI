import { Input, Label, ListBox, Select, TextField } from "@heroui/react"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import TablerCertificate from "~icons/tabler/certificate"

import { DEGREE_OPTIONS } from "../../constants"

import SectionHeader from "./SectionHeader"

import type { Control, FieldErrors } from "react-hook-form"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface CertificationSectionProps {
	control: Control<StaffProfileFormData>
	errors: FieldErrors<StaffProfileFormData>
}

const CertificationSection = ({ control }: CertificationSectionProps) => {
	const { t } = useTranslation()

	return (
		<section className="flex flex-col gap-6">
			<SectionHeader
				icon={<TablerCertificate className="size-5" />}
				title={t("staff.profile.sections.certification")}
			/>
			<div className="flex gap-2">
				<Controller
					control={control}
					name="degree"
					render={({ field }) => (
						<Select
							className="flex-1"
							variant="secondary"
							selectedKey={field.value ?? null}
							onSelectionChange={(key) => {
								if (key !== null) field.onChange(String(key))
							}}
						>
							<Label>{t("staff.profile.fields.degree")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{DEGREE_OPTIONS.map((d) => (
										<ListBox.Item id={d.key} key={d.key} textValue={t(d.labelKey)}>
											{t(d.labelKey)}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="certification"
					render={({ field }) => (
						<TextField className="flex-1" variant="secondary">
							<Label>{t("staff.profile.fields.certification")}</Label>

							<Input {...field} placeholder={t("staff.profile.placeholders.certification")} />
						</TextField>
					)}
				/>
			</div>
		</section>
	)
}

export default CertificationSection
