import { Button, Select, SelectItem, Skeleton } from "@heroui/react"
import { useInfiniteScroll } from "@heroui/use-infinite-scroll"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"

import { useInfiniteAllEmployees, useInfiniteAllStudents } from "../../hooks/useRooms"

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

	// Track when each Select dropdown is open for infinite scroll
	const [isEmployeesSelectOpen, setIsEmployeesSelectOpen] = useState(false)
	const [isStudentsSelectOpen, setIsStudentsSelectOpen] = useState(false)

	// Infinite scroll for employees list - enabled when dropdown is open
	const [, employeesScrollerRef] = useInfiniteScroll({
		hasMore: hasNextEmployees ?? false,
		isEnabled: isEmployeesSelectOpen,
		shouldUseLoader: false,
		onLoadMore: fetchNextEmployees,
	})

	// Infinite scroll for students list - enabled when dropdown is open
	const [, studentsScrollerRef] = useInfiniteScroll({
		hasMore: hasNextStudents ?? false,
		isEnabled: isStudentsSelectOpen,
		shouldUseLoader: false,
		onLoadMore: fetchNextStudents,
	})

	const refetchAll = () => Promise.all([refetchStudents(), refetchEmployees()])

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
							isLoading={isFetchingNextEmployees}
							items={employees}
							label="Add staff"
							labelPlacement="inside"
							listboxProps={{
								emptyContent: "No staff members available",
							}}
							maxListboxHeight={256}
							onOpenChange={setIsEmployeesSelectOpen}
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
							placeholder="Select staff members"
							radius="md"
							scrollRef={employeesScrollerRef}
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							variant="flat"
						>
							{(employee) => <SelectItem key={employee.id}>{employee.name}</SelectItem>}
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
							isLoading={isFetchingNextStudents}
							items={students}
							label="Add students"
							labelPlacement="inside"
							listboxProps={{
								emptyContent: "No students available",
							}}
							maxListboxHeight={256}
							onOpenChange={setIsStudentsSelectOpen}
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
							placeholder="Select students"
							radius="md"
							scrollRef={studentsScrollerRef}
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							variant="flat"
						>
							{(student) => <SelectItem key={student.id}>{student.name}</SelectItem>}
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default AddStaffStudentsStep
