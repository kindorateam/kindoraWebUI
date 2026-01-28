import { Chip, Input } from "@heroui/react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import TablerStethoscope from "~icons/tabler/stethoscope"

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

	const handleRemoveAllergy = (allergy: string) => {
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
					<TablerStethoscope className="size-4 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Medical info</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-2">
					<Input
						label="Allergies"
						labelPlacement="inside"
						onBlur={handleAddAllergy}
						onChange={(e) => setAllergyInput(e.target.value)}
						onKeyDown={handleAllergyKeyDown}
						placeholder="Type and press Enter to add"
						radius="md"
						size="sm"
						value={allergyInput}
						variant="flat"
					/>
					{allergies.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{allergies.map((allergy) => (
								<Chip key={allergy} color="default" onClose={() => handleRemoveAllergy(allergy)} variant="flat">
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
						<Input
							{...field}
							errorMessage={errors.medications?.message}
							isInvalid={!!errors.medications}
							label="Medications"
							labelPlacement="inside"
							radius="md"
							size="sm"
							value={field.value || ""}
							variant="flat"
						/>
					)}
				/>

				<Controller
					control={control}
					name="doctorName"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.doctorName?.message}
							isInvalid={!!errors.doctorName}
							label="Doctor"
							labelPlacement="inside"
							radius="md"
							size="sm"
							value={field.value || ""}
							variant="flat"
						/>
					)}
				/>

				<Controller
					control={control}
					name="doctorPhone"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.doctorPhone?.message}
							isInvalid={!!errors.doctorPhone}
							label="Doctor Phone"
							labelPlacement="inside"
							radius="md"
							size="sm"
							value={field.value || ""}
							variant="flat"
						/>
					)}
				/>
			</div>
		</div>
	)
}

export default MedicalInfoStep
