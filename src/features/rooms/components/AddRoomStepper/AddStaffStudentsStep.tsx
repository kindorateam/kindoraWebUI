import { Select, SelectItem, Skeleton } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"

import { useAllStudentsAndEmployees } from "../../hooks/useRooms"

import type { AddRoomFormData } from "../../types"

const AddStaffStudentsStepSkeleton = () => (
	<div className="flex flex-col gap-6">
		<Skeleton className="h-7 w-48 rounded-lg" />
		<div className="flex flex-col gap-3">
			<Skeleton className="h-14 w-full rounded-xl" />
			<Skeleton className="h-14 w-full rounded-xl" />
		</div>
	</div>
)

const AddStaffStudentsStep = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<AddRoomFormData>()

	const { students, employees, isLoading } = useAllStudentsAndEmployees()

	if (isLoading) {
		return <AddStaffStudentsStepSkeleton />
	}

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
							label="Add staff"
							labelPlacement="inside"
							listboxProps={{ emptyContent: "No staff members available" }}
							placeholder="Select staff members"
							radius="md"
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							variant="flat"
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
						>
							{employees.map((employee) => (
								<SelectItem key={employee.id}>{employee.name}</SelectItem>
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
							label="Add students"
							labelPlacement="inside"
							listboxProps={{ emptyContent: "No students available" }}
							placeholder="Select students"
							radius="md"
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							variant="flat"
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
						>
							{students.map((student) => (
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
