import { Button, Label, ListBox, Select, Skeleton } from "@heroui/react"
import { useEffect, useRef } from "react"
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

	// IntersectionObserver-based infinite scroll for employees
	const employeesObserverRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!employeesObserverRef.current || !hasNextEmployees || isFetchingNextEmployees) return
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) fetchNextEmployees()
			},
			{ threshold: 0.5 },
		)
		observer.observe(employeesObserverRef.current)
		return () => observer.disconnect()
	}, [hasNextEmployees, isFetchingNextEmployees, fetchNextEmployees])

	// IntersectionObserver-based infinite scroll for students
	const studentsObserverRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!studentsObserverRef.current || !hasNextStudents || isFetchingNextStudents) return
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) fetchNextStudents()
			},
			{ threshold: 0.5 },
		)
		observer.observe(studentsObserverRef.current)
		return () => observer.disconnect()
	}, [hasNextStudents, isFetchingNextStudents, fetchNextStudents])

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
							isInvalid={!!errors.staffIds}
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
						>
							<Label>Add staff</Label>
							<Select.Trigger>
								<Select.Value placeholder="Select staff members" />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{employees.map((employee) => (
										<ListBox.Item id={employee.id} key={employee.id} textValue={employee.name}>
											{employee.name}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
									{isFetchingNextEmployees && (
										<ListBox.Item id="loading-employees" textValue="Loading...">
											<span className="text-default-400 text-sm">Loading more...</span>
										</ListBox.Item>
									)}
								</ListBox>
								<div ref={employeesObserverRef} />
							</Select.Popover>
							{errors.staffIds?.message && <span className="text-danger text-xs">{errors.staffIds.message}</span>}
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="studentIds"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.studentIds}
							selectedKeys={new Set(field.value || [])}
							selectionMode="multiple"
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys) as string[])
							}}
						>
							<Label>Add students</Label>
							<Select.Trigger>
								<Select.Value placeholder="Select students" />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{students.map((student) => (
										<ListBox.Item id={student.id} key={student.id} textValue={student.name}>
											{student.name}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
									{isFetchingNextStudents && (
										<ListBox.Item id="loading-students" textValue="Loading...">
											<span className="text-default-400 text-sm">Loading more...</span>
										</ListBox.Item>
									)}
								</ListBox>
								<div ref={studentsObserverRef} />
							</Select.Popover>
							{errors.studentIds?.message && <span className="text-danger text-xs">{errors.studentIds.message}</span>}
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default AddStaffStudentsStep
