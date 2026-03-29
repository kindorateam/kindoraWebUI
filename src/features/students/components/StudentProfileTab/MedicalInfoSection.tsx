import { Chip, Input, Label, TextField } from "@heroui/react"

import JamMedical from "~icons/jam/medical"

import type { StudentMedicalInfo } from "../../types"

interface MedicalInfoSectionProps {
	medicalInfo?: StudentMedicalInfo
}

const MedicalInfoSection = ({ medicalInfo }: MedicalInfoSectionProps) => {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2 px-4 py-1.5">
				<JamMedical className="size-5 text-foreground" />
				<span className="font-semibold text-foreground text-sm">Medical info</span>
			</div>

			<div className="grid gap-2 lg:grid-cols-2">
				<TextField variant="secondary" isReadOnly>
					<Label>Allergies</Label>

					<Input value={medicalInfo?.allergies?.[0] ?? "No allergies"} />
				</TextField>
				<TextField variant="secondary" isReadOnly>
					<Label>Medications</Label>

					<Input value={medicalInfo?.medications ?? "-"} />
				</TextField>
				<div className="flex flex-wrap gap-2 lg:col-span-2">
					{(medicalInfo?.allergies?.length ? medicalInfo.allergies : ["No allergies"]).map((allergy) => (
						<Chip className="bg-primary-50" key={allergy} size="sm" variant="soft">
							{allergy}
						</Chip>
					))}
				</div>
				<TextField variant="secondary" isReadOnly>
					<Label>Doctor</Label>

					<Input value={medicalInfo?.doctor ?? "N/A"} />
				</TextField>
				<TextField variant="secondary" isReadOnly>
					<Label>Doctor Phone</Label>

					<Input value={medicalInfo?.doctorPhone ?? "N/A"} />
				</TextField>
			</div>
		</section>
	)
}

export default MedicalInfoSection
