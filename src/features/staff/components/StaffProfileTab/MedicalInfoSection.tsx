import { Chip, FieldError, Input, Label, TextField } from "@heroui/react"
import { useState } from "react"
import { Controller } from "react-hook-form"

import { formatUSPhone } from "@/utils/format"
import JamMedical from "~icons/jam/medical"

import SectionHeader from "./SectionHeader"

import type { Control, FieldErrors } from "react-hook-form"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface MedicalInfoSectionProps {
	control: Control<StaffProfileFormData>
	errors: FieldErrors<StaffProfileFormData>
	allergies: string[]
	onAllergiesChange: (allergies: string[]) => void
}

const MedicalInfoSection = ({ control, errors, allergies, onAllergiesChange }: MedicalInfoSectionProps) => {
	const [allergyInput, setAllergyInput] = useState("")

	const handleAddAllergy = () => {
		const trimmed = allergyInput.trim()
		if (trimmed && !allergies.includes(trimmed)) {
			onAllergiesChange([...allergies, trimmed])
		}
		setAllergyInput("")
	}

	const handleAllergyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			handleAddAllergy()
		}
	}

	return (
		<section className="flex flex-col gap-6">
			<SectionHeader icon={<JamMedical className="size-5" />} title="Medical info" />
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<div className="flex flex-1 flex-col gap-2">
						<TextField variant="secondary">
							<Label>Allergies</Label>

							<Input
								onChange={(e) => setAllergyInput(e.target.value)}
								onKeyDown={handleAllergyKeyDown}
								placeholder="Type and press Enter"
								value={allergyInput}
							/>
						</TextField>
						{allergies.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{allergies.map((allergy, i) => (
									<Chip
										// biome-ignore lint/suspicious/noArrayIndexKey: allergy strings may repeat
										key={i}
										size="sm"
										variant="soft"
									>
										{allergy}
									</Chip>
								))}
							</div>
						)}
					</div>
					<Controller
						control={control}
						name="medications"
						render={({ field }) => (
							<TextField className="flex-1" variant="secondary">
								<Label>Medications</Label>

								<Input {...field} />
							</TextField>
						)}
					/>
				</div>
				<div className="flex gap-2">
					<Controller
						control={control}
						name="doctorName"
						render={({ field }) => (
							<TextField className="flex-1" variant="secondary">
								<Label>Doctor</Label>

								<Input {...field} />
							</TextField>
						)}
					/>
					<Controller
						control={control}
						name="doctorPhone"
						render={({ field }) => (
							<TextField className="flex-1" isInvalid={!!errors.doctorPhone} variant="secondary">
								<Label>Doctor phone</Label>

								<Input
									{...field}
									onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
									placeholder="(555) 123-4567"
									type="tel"
								/>

								<FieldError>{errors.doctorPhone?.message}</FieldError>
							</TextField>
						)}
					/>
				</div>
			</div>
		</section>
	)
}

export default MedicalInfoSection
