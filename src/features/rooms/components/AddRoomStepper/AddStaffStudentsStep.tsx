import { Button, Select, SelectItem, Skeleton } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"

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

	const { students, employees, error, isError, isLoading, refetchAll } = useAllStudentsAndEmployees()

	if (isLoading) {
		return <AddStaffStudentsStepSkeleton />
	}

	if (isError) {
		return (
			<div className="flex flex-col gap-6">
				<h2 className="font-medium text-xl">Add Staff & Students</h2>
				<div className="rounded-lg bg-danger-50 p-4 text-danger-700 text-sm">
					<p className="font-medium">Failed to load staff and students</p>
					<p className="mt-1 text-danger-600">{getErrorMessage(error) ?? "Please try again."}</p>
				</div>
				<Button
					color="primary"
					onPress={() => {
						void refetchAll()
					}}
					fullWidth
					size="lg"
				>
					Retry
				</Button>
			</div>
		)
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
