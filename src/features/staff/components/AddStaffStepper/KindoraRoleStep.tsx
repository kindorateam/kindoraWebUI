import { DateField, FieldError, Label, ListBox, Select } from "@heroui/react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { parseDateValue, serializeDateValue } from "@/utils/date"
import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"

import { MOCK_ROOMS, PERMISSION_OPTIONS, STAFF_ROLES } from "../../constants"

import AddStaffStepHeader from "./AddStaffStepHeader"

import type { AddStaffFormData } from "../../schemas/addStaff.schema"

const KindoraRoleStep = () => {
	const { t } = useTranslation()
	const {
		control,
		formState: { errors },
	} = useFormContext<AddStaffFormData>()

	return (
		<div className="flex flex-col gap-6">
			<AddStaffStepHeader
				icon={<EosIconsRoleBindingOutlined className="size-5 text-foreground" />}
				title={t("staff.profile.sections.kindoraRole")}
			/>

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
							onChange={(value) => field.onChange(serializeDateValue(value))}
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
