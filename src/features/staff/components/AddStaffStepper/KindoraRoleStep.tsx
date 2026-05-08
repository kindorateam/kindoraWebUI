import { DateField, FieldError, Label, ListBox, Select } from "@heroui/react"
import { parseDate } from "@internationalized/date"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"

import { MOCK_ROOMS, PERMISSION_OPTIONS, STAFF_ROLES } from "../../constants"

import type { DateValue } from "@internationalized/date"
import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const KindoraRoleStep = () => {
	const { t } = useTranslation()
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
				<h2 className="font-medium text-xl">{t("staff.addStaff.title")}</h2>
				<div className="flex items-center gap-2.5 py-1.5">
					<EosIconsRoleBindingOutlined className="size-5 text-foreground" />
					<span className="font-semibold text-foreground text-sm">{t("staff.profile.sections.kindoraRole")}</span>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Controller
					control={control}
					name="role"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.role}
							onSelectionChange={(key) => {
								if (key !== undefined) {
									field.onChange(String(key))
								}
							}}
							selectedKey={field.value ?? null}
							variant="secondary"
						>
							<Label>{t("staff.profile.fields.role")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{STAFF_ROLES.map((role) => (
										<ListBox.Item id={role.key} key={role.key} textValue={t(role.labelKey)}>
											{t(role.labelKey)}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							<FieldError>{errors.role?.message}</FieldError>
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="hireDate"
					render={({ field }) => (
						<DateField
							granularity="day"
							isInvalid={!!errors.hireDate}
							onChange={(value) => handleDateChange(value, field.onChange)}
							value={parseDateValue(field.value)}
						>
							<Label>{t("staff.profile.fields.hireDate")}</Label>
							<DateField.Group variant="secondary">
								<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
							</DateField.Group>
							<FieldError>{errors.hireDate?.message}</FieldError>
						</DateField>
					)}
				/>

				<Controller
					control={control}
					name="assignedRooms"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.assignedRooms}
							onChange={(keys) => {
								field.onChange(keys as string[])
							}}
							value={field.value || []}
							selectionMode="multiple"
							variant="secondary"
						>
							<Label>{t("staff.profile.fields.assignedRooms")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{MOCK_ROOMS.map((room) => (
										<ListBox.Item id={room.key} key={room.key} textValue={room.label}>
											{room.label}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							<FieldError>{errors.assignedRooms?.message}</FieldError>
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="permissions"
					render={({ field }) => (
						<Select
							isInvalid={!!errors.permissions}
							onChange={(keys) => {
								field.onChange(keys as string[])
							}}
							value={field.value || []}
							selectionMode="multiple"
							variant="secondary"
						>
							<Label>{t("staff.profile.fields.permissions")}</Label>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{PERMISSION_OPTIONS.map((permission) => (
										<ListBox.Item id={permission.key} key={permission.key} textValue={t(permission.labelKey)}>
											{t(permission.labelKey)}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
							<FieldError>{errors.permissions?.message}</FieldError>
						</Select>
					)}
				/>
			</div>
		</div>
	)
}

export default KindoraRoleStep
