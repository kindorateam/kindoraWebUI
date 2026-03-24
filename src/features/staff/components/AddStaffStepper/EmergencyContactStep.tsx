import { FieldError,
	Input, Label, ListBox, Select, TextField,
	} from "@heroui/react"
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
						<TextField isInvalid={!!errors.emergencyContactName} variant="secondary">

							<Label>Name</Label>

							<Input
							{...field}
							value={field.value || ""}/>

							<FieldError>{errors.emergencyContactName?.message}</FieldError>

						</TextField>
					)}
				/>

				<Controller
					control={control}
					name="emergencyContactPhone"
					render={({ field }) => (
						<TextField isInvalid={!!errors.emergencyContactPhone} variant="secondary">

							<Label>Phone</Label>

							<Input
							{...field}
							value={field.value || ""}/>

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
						>
							<Label>Relationship to staff</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{RELATIONSHIP_OPTIONS.map((option) => (
										<ListBox.Item id={option.key} key={option.key} textValue={option.label}>
											{option.label}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							{errors.emergencyContactRelationship?.message && (
								<span className="text-danger text-xs">{errors.emergencyContactRelationship.message}</span>
							)}
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default EmergencyContactStep
