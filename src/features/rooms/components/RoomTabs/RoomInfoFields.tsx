import { FieldError, Input, Label, ListBox, NumberField, Select, TextField } from "@heroui/react"
import { Controller } from "react-hook-form"

import { ROOM_AGE_OPTIONS } from "../../constants"

import type { Control, FieldErrors, UseFormTrigger } from "react-hook-form"
import type { RoomProfileFormData } from "../../schemas/roomProfile.schema"

const ageListItems = ROOM_AGE_OPTIONS.map((option) => (
	<ListBox.Item id={String(option.key)} key={option.key} textValue={option.label}>
		{option.label}
		<ListBox.ItemIndicator />
	</ListBox.Item>
))

interface RoomInfoFieldsProps {
	control: Control<RoomProfileFormData>
	errors: FieldErrors<RoomProfileFormData>
	trigger: UseFormTrigger<RoomProfileFormData>
}

const RoomInfoFields = ({ control, errors, trigger }: RoomInfoFieldsProps) => {
	return (
		<div className="flex flex-col gap-5">
			<h3 className="font-medium text-xl">Room Info</h3>
			<div className="grid grid-cols-2 gap-2">
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField className="col-span-2" isRequired isInvalid={!!errors.name} variant="secondary">
							<Label>Room Name</Label>
							<Input {...field} />
							<FieldError>{errors.name?.message}</FieldError>
						</TextField>
					)}
				/>
				<Controller
					control={control}
					name="minAge"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.minAge}
							isRequired
							variant="secondary"
							selectedKey={field.value !== undefined ? String(field.value) : null}
							onSelectionChange={(key) => {
								if (key !== null) {
									field.onChange(Number(key))
									void trigger(["minAge", "maxAge"])
								}
							}}
						>
							<Label>Min age</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover className="max-h-60!">
								<ListBox>{ageListItems}</ListBox>
							</Select.Popover>
							{errors.minAge?.message && <FieldError>{errors.minAge.message}</FieldError>}
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="maxAge"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.maxAge}
							isRequired
							variant="secondary"
							selectedKey={field.value !== undefined ? String(field.value) : null}
							onSelectionChange={(key) => {
								if (key !== null) {
									field.onChange(Number(key))
									void trigger(["minAge", "maxAge"])
								}
							}}
						>
							<Label>Max age</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover className="max-h-60!">
								<ListBox>{ageListItems}</ListBox>
							</Select.Popover>
							{errors.maxAge?.message && <FieldError>{errors.maxAge.message}</FieldError>}
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="capacity"
					render={({ field }) => (
						<NumberField
							isInvalid={!!errors.capacity}
							isRequired
							minValue={1}
							variant="secondary"
							onChange={(value) => field.onChange(Number.isNaN(value) ? 1 : value)}
							value={field.value}
						>
							<Label>Max capacity</Label>
							<NumberField.Group>
								<NumberField.DecrementButton />
								<NumberField.Input />
								<NumberField.IncrementButton />
							</NumberField.Group>
							{errors.capacity?.message && <FieldError>{errors.capacity.message}</FieldError>}
						</NumberField>
					)}
				/>
				<Controller
					control={control}
					name="ratio"
					render={({ field }) => (
						<NumberField
							isInvalid={!!errors.ratio}
							isRequired
							minValue={0}
							variant="secondary"
							onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
							value={field.value}
						>
							<Label>Students per 1 staff</Label>
							<NumberField.Group>
								<NumberField.DecrementButton />
								<NumberField.Input />
								<NumberField.IncrementButton />
							</NumberField.Group>
							{errors.ratio?.message && <FieldError>{errors.ratio.message}</FieldError>}
						</NumberField>
					)}
				/>
			</div>
		</div>
	)
}

export default RoomInfoFields
