import { Chip, FieldError, Input, Label, TextField } from "@heroui/react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import JamMedical from "~icons/jam/medical"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const MedicalInfoStep = () => {
	const {
		control,
		formState: { errors },
		watch,
		setValue,
	} = useFormContext<AddStaffFormData>()

	const [allergyInput, setAllergyInput] = useState("")
	const allergies = watch("allergies") || []

	const handleAddAllergy = () => {
		const trimmed = allergyInput.trim()
		if (trimmed && !allergies.includes(trimmed)) {
			setValue("allergies", [...allergies, trimmed])
			setAllergyInput("")
		}
	}

	const handleAllergyKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault()
			handleAddAllergy()
		}
	}

	const _handleRemoveAllergy = (allergy: string) => {
		setValue(
			"allergies",
			allergies.filter((a) => a !== allergy),
		)
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-xl">Add staff</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<JamMedical className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Medical info</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-2">
					<TextField variant="secondary">
						<Label>Allergies</Label>

						<Input
							onBlur={handleAddAllergy}
							onChange={(e) => setAllergyInput(e.target.value)}
							onKeyDown={handleAllergyKeyDown}
							placeholder="Type and press Enter to add"
							value={allergyInput}
						/>
					</TextField>
					{allergies.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{allergies.map((allergy) => (
								<Chip key={allergy} color="default" variant="soft">
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
						<TextField isInvalid={!!errors.medications} variant="secondary">
							<Label>Medications</Label>

							<Input {...field} value={field.value || ""} />

							<FieldError>{errors.medications?.message}</FieldError>
						</TextField>
					)}
				/>

				<Controller
					control={control}
					name="doctorName"
					render={({ field }) => (
						<TextField isInvalid={!!errors.doctorName} variant="secondary">
							<Label>Doctor</Label>

							<Input {...field} value={field.value || ""} />

							<FieldError>{errors.doctorName?.message}</FieldError>
						</TextField>
					)}
				/>

				<Controller
					control={control}
					name="doctorPhone"
					render={({ field }) => (
						<TextField isInvalid={!!errors.doctorPhone} variant="secondary">
							<Label>Doctor Phone</Label>

							<Input {...field} value={field.value || ""} />

							<FieldError>{errors.doctorPhone?.message}</FieldError>
						</TextField>
					)}
				/>
			</div>
		</div>
	)
}

export default MedicalInfoStep
