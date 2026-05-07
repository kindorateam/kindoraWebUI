import { Chip, Input, Label, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import JamMedical from "~icons/jam/medical"

import type { StudentMedicalInfo } from "../../types"

interface MedicalInfoSectionProps {
	medicalInfo?: StudentMedicalInfo
}

const MedicalInfoSection = ({ medicalInfo }: MedicalInfoSectionProps) => {
	const { t } = useTranslation()

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<JamMedical className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">
					{t("students.detail.profile.sections.medicalInfo")}
				</span>
			</div>

			<div className="grid gap-2 lg:grid-cols-2">
				<TextField variant="secondary" isReadOnly>
					<Label>{t("students.detail.profile.fields.allergies")}</Label>

					<Input value={medicalInfo?.allergies?.[0] ?? t("students.detail.profile.noAllergies")} />
				</TextField>
				<TextField variant="secondary" isReadOnly>
					<Label>{t("students.detail.profile.fields.medications")}</Label>

					<Input value={medicalInfo?.medications ?? "-"} />
				</TextField>
				<div className="flex flex-wrap gap-2 lg:col-span-2">
					{(medicalInfo?.allergies?.length ? medicalInfo.allergies : [t("students.detail.profile.noAllergies")]).map(
						(allergy) => (
							<Chip className="bg-primary-50" key={allergy} size="sm" variant="soft">
								{allergy}
							</Chip>
						),
					)}
				</div>
				<TextField variant="secondary" isReadOnly>
					<Label>{t("students.detail.profile.fields.doctor")}</Label>

					<Input value={medicalInfo?.doctor ?? t("common.notAvailable")} />
				</TextField>
				<TextField variant="secondary" isReadOnly>
					<Label>{t("students.detail.profile.fields.doctorPhone")}</Label>

					<Input value={medicalInfo?.doctorPhone ?? t("common.notAvailable")} />
				</TextField>
			</div>
		</section>
	)
}

export default MedicalInfoSection
