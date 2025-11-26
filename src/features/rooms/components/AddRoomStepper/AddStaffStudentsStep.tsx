import { Select, SelectItem } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"

import type { AddRoomFormData } from "../../types"

// TODO: Replace with actual data from API
const mockStaff = [
	{ id: "1", name: "John Smith" },
	{ id: "2", name: "Sarah Johnson" },
	{ id: "3", name: "Michael Brown" },
]

const mockStudents = [
	{ id: "1", name: "Emma Wilson" },
	{ id: "2", name: "James Davis" },
	{ id: "3", name: "Olivia Martinez" },
	{ id: "4", name: "William Anderson" },
]

const AddStaffStudentsStep = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<AddRoomFormData>()

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-medium text-xl">Add Staff & Students</h2>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="staffIds"
					render={({ field }) => (
						<Select
							errorMessage={errors.staffIds?.message}
							isInvalid={!!errors.staffIds}
							isRequired
							label="Add staff"
							labelPlacement="inside"
							placeholder="Select staff members"
							radius="md"
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							variant="flat"
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
						>
							{mockStaff.map((staff) => (
								<SelectItem key={staff.id}>{staff.name}</SelectItem>
							))}
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="studentIds"
					render={({ field }) => (
						<Select
							errorMessage={errors.studentIds?.message}
							isInvalid={!!errors.studentIds}
							isRequired
							label="Add students"
							labelPlacement="inside"
							placeholder="Select students"
							radius="md"
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							variant="flat"
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
						>
							{mockStudents.map((student) => (
								<SelectItem key={student.id}>{student.name}</SelectItem>
							))}
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default AddStaffStudentsStep
