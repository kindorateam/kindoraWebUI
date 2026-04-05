import { Button, Collection, FieldError, Label, ListBox, Select, Skeleton, Spinner } from "@heroui/react"
import { useRef } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"

import { useInfiniteAllEmployees, useInfiniteAllStudents } from "../../hooks/useRooms"
import { handleSelectPopoverScroll } from "../../utils/handleSelectPopoverScroll"

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

	const {
		students,
		isLoading: isLoadingStudents,
		isError: isStudentsError,
		error: studentsError,
		refetch: refetchStudents,
		fetchNextPage: fetchNextStudents,
		hasNextPage: hasNextStudents,
		isFetchingNextPage: isFetchingNextStudents,
	} = useInfiniteAllStudents()

	const {
		employees,
		isLoading: isLoadingEmployees,
		isError: isEmployeesError,
		error: employeesError,
		refetch: refetchEmployees,
		fetchNextPage: fetchNextEmployees,
		hasNextPage: hasNextEmployees,
		isFetchingNextPage: isFetchingNextEmployees,
	} = useInfiniteAllEmployees()

	const isLoading = isLoadingStudents || isLoadingEmployees

	const isError = isStudentsError || isEmployeesError
	const error = studentsError || employeesError

	const refetchAll = () => Promise.all([refetchStudents(), refetchEmployees()])
	const employeeLoadMoreLockRef = useRef(false)
	const studentLoadMoreLockRef = useRef(false)

	if (isLoading) {
		return <AddStaffStudentsStepSkeleton />
	}

	if (isError) {
		return (
			<div className="flex flex-col gap-6">
				<h2 className="font-medium text-foreground text-xl">Add Staff & Students</h2>
				<div className="rounded-lg bg-danger-50 p-4 text-danger-700 text-sm">
					<p className="font-medium">Failed to load staff and students</p>
					<p className="mt-1 text-danger-600">{getErrorMessage(error) ?? "Please try again."}</p>
				</div>
				<Button
					variant="primary"
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
			<h2 className="font-medium text-foreground text-xl">Add Staff & Students</h2>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="staffIds"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.staffIds}
							selectionMode="multiple"
							variant="secondary"
							value={field.value || []}
							onChange={(keys) => {
								field.onChange(keys as string[])
							}}
						>
							<Label>Add staff</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover
								className="max-h-60!"
								onScroll={(e) => {
									handleSelectPopoverScroll(
										e,
										hasNextEmployees ?? false,
										isFetchingNextEmployees,
										employeeLoadMoreLockRef,
										fetchNextEmployees,
									)
								}}
							>
								<ListBox>
									<Collection items={employees}>
										{(employee) => (
											<ListBox.Item id={employee.id} textValue={employee.name}>
												{employee.name}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										)}
									</Collection>
								</ListBox>
								{isFetchingNextEmployees && (
									<div className="flex items-center justify-center gap-2 py-2">
										<Spinner size="sm" />
										<span className="text-muted text-sm">Loading more...</span>
									</div>
								)}
							</Select.Popover>
							{errors.staffIds?.message && <FieldError>{errors.staffIds.message}</FieldError>}
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="studentIds"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.studentIds}
							selectionMode="multiple"
							variant="secondary"
							value={field.value || []}
							onChange={(keys) => {
								field.onChange(keys as string[])
							}}
						>
							<Label>Add students</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover
								className="max-h-60!"
								onScroll={(e) => {
									handleSelectPopoverScroll(
										e,
										hasNextStudents ?? false,
										isFetchingNextStudents,
										studentLoadMoreLockRef,
										fetchNextStudents,
									)
								}}
							>
								<ListBox>
									<Collection items={students}>
										{(student) => (
											<ListBox.Item id={student.id} textValue={student.name}>
												{student.name}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										)}
									</Collection>
								</ListBox>
								{isFetchingNextStudents && (
									<div className="flex items-center justify-center gap-2 py-2">
										<Spinner size="sm" />
										<span className="text-muted text-sm">Loading more...</span>
									</div>
								)}
							</Select.Popover>
							{errors.studentIds?.message && <FieldError>{errors.studentIds.message}</FieldError>}
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default AddStaffStudentsStep
