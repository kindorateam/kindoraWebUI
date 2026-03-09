import { Input, Select, SelectItem } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"

import StreamlineUltimateEmergencyCall from "~icons/streamline-ultimate/emergency-call"

import { RELATIONSHIP_OPTIONS } from "../../constants"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const EmergencyContactStep = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-xl">Add staff</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<StreamlineUltimateEmergencyCall className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Emergency contact</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="emergencyContactName"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.emergencyContactName?.message}
							isInvalid={!!errors.emergencyContactName}
							label="Name"
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
					name="emergencyContactPhone"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.emergencyContactPhone?.message}
							isInvalid={!!errors.emergencyContactPhone}
							label="Phone"
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
					name="emergencyContactRelationship"
					render={({ field }) => (
						<Select
							errorMessage={errors.emergencyContactRelationship?.message}
							isInvalid={!!errors.emergencyContactRelationship}
							label="Relationship to staff"
							labelPlacement="inside"
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0]
								if (selected !== undefined) {
									field.onChange(String(selected))
								}
							}}
							radius="md"
							selectedKeys={field.value ? [field.value] : []}
							size="sm"
							variant="flat"
						>
							{RELATIONSHIP_OPTIONS.map((option) => (
								<SelectItem key={option.key}>{option.label}</SelectItem>
							))}
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default EmergencyContactStep
