import { Chip, Select, SelectItem } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"

import SolarCalendarBroken from "~icons/solar/calendar-broken"

import { WORKING_DAYS } from "../../constants"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const ScheduleStep = () => {
	const {
		control,
		formState: { errors },
		watch,
		setValue,
	} = useFormContext<AddStaffFormData>()

	const workingDays = watch("workingDays") || []

	const handleToggleDay = (dayKey: string) => {
		if (workingDays.includes(dayKey)) {
			setValue(
				"workingDays",
				workingDays.filter((d) => d !== dayKey),
			)
		} else {
			setValue("workingDays", [...workingDays, dayKey])
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-xl">Add staff</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<SolarCalendarBroken className="size-4 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Schedule</span>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Controller
					control={control}
					name="workingDays"
					render={({ field }) => (
						<Select
							errorMessage={errors.workingDays?.message}
							isInvalid={!!errors.workingDays}
							label="Schedule working days"
							labelPlacement="inside"
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
							radius="md"
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							size="sm"
							variant="flat"
						>
							{WORKING_DAYS.map((day) => (
								<SelectItem key={day.key}>{day.label}</SelectItem>
							))}
						</Select>
					)}
				/>
				<div className="flex flex-wrap gap-1.5">
					{WORKING_DAYS.map((day) => {
						const isActive = workingDays.includes(day.key)
						return (
							<Chip
								key={day.key}
								as="button"
								className={isActive ? "cursor-pointer" : "cursor-pointer opacity-30"}
								color="primary"
								onClick={() => handleToggleDay(day.key)}
								variant="flat"
							>
								{day.label}
							</Chip>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default ScheduleStep
