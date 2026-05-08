import { FieldError, Input, Label, TextField } from "@heroui/react"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { formatUSPhone } from "@/utils/format"
import StreamlineUltimateEmergencyCall from "~icons/streamline-ultimate/emergency-call"

import SectionHeader from "./SectionHeader"

import type { Control, FieldErrors } from "react-hook-form"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface EmergencyContactSectionProps {
	control: Control<StaffProfileFormData>
	errors: FieldErrors<StaffProfileFormData>
	emergencyContacts: StaffProfileFormData["emergencyContacts"]
}

const EmergencyContactSection = ({ control, errors, emergencyContacts }: EmergencyContactSectionProps) => {
	const { t } = useTranslation()

	return (
		<section className="flex flex-col gap-6">
			<SectionHeader
				icon={<StreamlineUltimateEmergencyCall className="size-5" />}
				title={t("staff.profile.sections.emergencyContact")}
			/>
			<div className="flex flex-col gap-2">
				{emergencyContacts.map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: emergency contacts may not have stable ids
					<div key={index} className="flex items-start gap-2">
						<Controller
							control={control}
							name={`emergencyContacts.${index}.name`}
							render={({ field }) => (
								<TextField className="flex-1" isInvalid={!!errors.emergencyContacts?.[index]?.name} variant="secondary">
									<Label>{t("staff.profile.fields.name")}</Label>

									<Input {...field} placeholder={t("staff.profile.placeholders.name")} />

									<FieldError>{errors.emergencyContacts?.[index]?.name?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name={`emergencyContacts.${index}.phone`}
							render={({ field }) => (
								<TextField
									className="flex-1"
									isInvalid={!!errors.emergencyContacts?.[index]?.phone}
									variant="secondary"
								>
									<Label>{t("staff.profile.fields.phone")}</Label>

									<Input
										{...field}
										onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
										placeholder={t("staff.profile.placeholders.phone")}
										type="tel"
									/>

									<FieldError>{errors.emergencyContacts?.[index]?.phone?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name={`emergencyContacts.${index}.relationshipTo`}
							render={({ field }) => (
								<TextField className="flex-1" variant="secondary">
									<Label>{t("staff.profile.fields.relationshipToStaff")}</Label>

									<Input {...field} placeholder={t("staff.profile.placeholders.relationshipToStaff")} />
								</TextField>
							)}
						/>
					</div>
				))}
			</div>
		</section>
	)
}

export default EmergencyContactSection
