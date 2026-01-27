import { DateInput, Input, Select, SelectItem, Textarea } from "@heroui/react"
import { parseDate } from "@internationalized/date"
import { Controller, useFormContext } from "react-hook-form"

import TablerUserCircle from "~icons/tabler/user-circle"

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
					<TablerUserCircle className="size-4 text-foreground" />
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
						<DateInput
							errorMessage={errors.birthday?.message}
							granularity="day"
							isInvalid={!!errors.birthday}
							label="Birthday"
							labelPlacement="inside"
							onChange={(value) => handleDateChange(value, field.onChange)}
							radius="md"
							size="sm"
							value={parseDateValue(field.value)}
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="enrollDate"
					render={({ field }) => (
						<DateInput
							errorMessage={errors.enrollDate?.message}
							granularity="day"
							isInvalid={!!errors.enrollDate}
							label="Enroll date"
							labelPlacement="inside"
							onChange={(value) => handleDateChange(value, field.onChange)}
							radius="md"
							size="sm"
							value={parseDateValue(field.value)}
							variant="flat"
						/>
					)}
				/>
				<Controller
					control={control}
					name="state"
					render={({ field }) => (
						<Select
							errorMessage={errors.state?.message}
							isInvalid={!!errors.state}
							label="State"
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
							{US_STATES.map((state) => (
								<SelectItem key={state.key}>{state.label}</SelectItem>
							))}
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
						<Textarea
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
