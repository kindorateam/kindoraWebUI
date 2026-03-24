import { DateField, Input, Label, ListBox, Select, TextArea } from "@heroui/react"
import { parseDate } from "@internationalized/date"
import { Controller, useFormContext } from "react-hook-form"

import LucideUserRound from "~icons/lucide/user-round"

import { US_STATES } from "../../constants"

import type { DateValue } from "@internationalized/date"
import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const PersonalInfoStep = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	const handleDateChange = (value: DateValue | null, onChange: (value: string | undefined) => void) => {
		if (value) {
			onChange(value.toString())
		} else {
			onChange(undefined)
		}
	}

	const parseDateValue = (value: string | undefined): DateValue | null => {
		if (!value) return null
		try {
			return parseDate(value)
		} catch {
			return null
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-xl">Add staff</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<LucideUserRound className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Personal info</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="phone"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.phone?.message}
							isInvalid={!!errors.phone}
							label="Phone"
							labelPlacement="inside"
							placeholder="Enter phone number"
							radius="md"
							size="sm"
							type="tel"
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="birthday"
					render={({ field }) => (
						<DateField
							granularity="day"
							isInvalid={!!errors.birthday}
							onChange={(value) => handleDateChange(value, field.onChange)}
							value={parseDateValue(field.value)}
						>
							<Label>Birthday</Label>
							<DateField.Group>
								<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
							</DateField.Group>
							{errors.birthday?.message && <span className="text-danger text-xs">{errors.birthday.message}</span>}
						</DateField>
					)}
				/>
				<Controller
					control={control}
					name="enrollDate"
					render={({ field }) => (
						<DateField
							granularity="day"
							isInvalid={!!errors.enrollDate}
							onChange={(value) => handleDateChange(value, field.onChange)}
							value={parseDateValue(field.value)}
						>
							<Label>Enroll date</Label>
							<DateField.Group>
								<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
							</DateField.Group>
							{errors.enrollDate?.message && <span className="text-danger text-xs">{errors.enrollDate.message}</span>}
						</DateField>
					)}
				/>
				<Controller
					control={control}
					name="state"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.state}
							onSelectionChange={(key) => {
								if (key !== undefined) {
									field.onChange(String(key))
								}
							}}
							selectedKey={field.value ?? null}
						>
							<Label>State</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{US_STATES.map((state) => (
										<ListBox.Item id={state.key} key={state.key} textValue={state.label}>
											{state.label}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							{errors.state?.message && <span className="text-danger text-xs">{errors.state.message}</span>}
						</Select>
					)}
				/>
				<Controller
					control={control}
					name="city"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.city?.message}
							isInvalid={!!errors.city}
							label="City"
							labelPlacement="inside"
							placeholder="Enter city"
							radius="md"
							size="sm"
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="streetAddress"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.streetAddress?.message}
							isInvalid={!!errors.streetAddress}
							label="Street address"
							labelPlacement="inside"
							placeholder="Enter street address"
							radius="md"
							size="sm"
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="zipCode"
					render={({ field }) => (
						<Input
							{...field}
							errorMessage={errors.zipCode?.message}
							isInvalid={!!errors.zipCode}
							label="ZIP code"
							labelPlacement="inside"
							placeholder="Enter ZIP code"
							radius="md"
							size="sm"
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<TextArea
							{...field}
							errorMessage={errors.notes?.message}
							isInvalid={!!errors.notes}
							label="Notes"
							labelPlacement="inside"
							placeholder="Enter notes"
							radius="md"
							size="sm"
							variant="flat"
						/>
					)}
				/>
			</div>
		</div>
	)
}

export default PersonalInfoStep
