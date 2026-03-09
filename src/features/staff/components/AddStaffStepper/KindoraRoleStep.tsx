import { DateInput, Select, SelectItem } from "@heroui/react"
import { parseDate } from "@internationalized/date"
import { Controller, useFormContext } from "react-hook-form"

import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"

import { MOCK_ROOMS, PERMISSION_OPTIONS, STAFF_ROLES } from "../../constants"

import type { DateValue } from "@internationalized/date"
import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const KindoraRoleStep = () => {
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
					<EosIconsRoleBindingOutlined className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">Kindora role & status</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="role"
					render={({ field }) => (
						<Select
							errorMessage={errors.role?.message}
							isInvalid={!!errors.role}
							label="Role"
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
							{STAFF_ROLES.map((role) => (
								<SelectItem key={role.key}>{role.label}</SelectItem>
							))}
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="hireDate"
					render={({ field }) => (
						<DateInput
							errorMessage={errors.hireDate?.message}
							granularity="day"
							isInvalid={!!errors.hireDate}
							label="Hire date"
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
					name="assignedRooms"
					render={({ field }) => (
						<Select
							errorMessage={errors.assignedRooms?.message}
							isInvalid={!!errors.assignedRooms}
							label="Assigned rooms"
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
							{MOCK_ROOMS.map((room) => (
								<SelectItem key={room.key}>{room.label}</SelectItem>
							))}
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="permissions"
					render={({ field }) => (
						<Select
							errorMessage={errors.permissions?.message}
							isInvalid={!!errors.permissions}
							label="Permissions"
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
							{PERMISSION_OPTIONS.map((permission) => (
								<SelectItem key={permission.key}>{permission.label}</SelectItem>
							))}
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default KindoraRoleStep
