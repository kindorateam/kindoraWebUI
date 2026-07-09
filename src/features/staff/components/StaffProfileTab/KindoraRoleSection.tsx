import { Chip, Label, ListBox, Select } from "@heroui/react"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import DatePickerField from "@/components/ui/DatePickerField"
import { parseDateValue, serializeDateValue } from "@/utils/date"
import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"

import { MOCK_ROOMS, SIGNUP_STATUS_OPTIONS, STAFF_ROLES } from "../../constants"

import SectionHeader from "./SectionHeader"

import type { Control } from "react-hook-form"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface KindoraRoleSectionProps {
	control: Control<StaffProfileFormData>
	assignedRooms: string[]
}

const getRoomLabel = (key: string) => MOCK_ROOMS.find((r) => r.key === key)?.label ?? key

const KindoraRoleSection = ({ control, assignedRooms }: KindoraRoleSectionProps) => {
	const { t } = useTranslation()

	return (
		<section className="flex flex-col gap-6">
			<SectionHeader
				icon={<EosIconsRoleBindingOutlined className="size-5" />}
				title={t("staff.profile.sections.kindoraRole")}
			/>
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<Controller
						control={control}
						name="signUpStatus"
						render={({ field }) => (
							<Select
								className="flex-1"
								variant="secondary"
								isDisabled
								selectedKey={field.value ?? null}
								onSelectionChange={(key) => {
									if (key !== null) field.onChange(String(key))
								}}
							>
								<Label>{t("staff.profile.fields.signUpStatus")}</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{SIGNUP_STATUS_OPTIONS.map((s) => (
											<ListBox.Item id={s.key} key={s.key} textValue={t(s.labelKey)}>
												{t(s.labelKey)}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
									</ListBox>
								</Select.Popover>
							</Select>
						)}
					/>
					<Controller
						control={control}
						name="role"
						render={({ field }) => (
							<Select
								className="flex-1"
								variant="secondary"
								isRequired
								selectedKey={field.value ?? null}
								onSelectionChange={(key) => {
									if (key !== null) field.onChange(String(key))
								}}
							>
								<Label>{t("staff.profile.fields.role")}</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{STAFF_ROLES.map((r) => (
											<ListBox.Item id={r.key} key={r.key} textValue={t(r.labelKey)}>
												{t(r.labelKey)}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
									</ListBox>
								</Select.Popover>
							</Select>
						)}
					/>
				</div>
				<div className="flex gap-2">
					<Controller
						control={control}
						name="assignedRooms"
						render={({ field }) => (
							<div className="flex flex-1 flex-col gap-2">
								<Select
									variant="secondary"
									selectionMode="multiple"
									value={field.value || []}
									onChange={(keys) => {
										field.onChange(keys as string[])
									}}
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
								</Select>
								{assignedRooms.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{assignedRooms.map((roomKey) => (
											<Chip key={roomKey} size="sm" variant="soft">
												{getRoomLabel(roomKey)}
											</Chip>
										))}
									</div>
								)}
							</div>
						)}
					/>
					<Controller
						control={control}
						name="hireDate"
						render={({ field }) => (
							<DatePickerField
								className="flex-1"
								label={t("staff.profile.fields.hireDate")}
								onChange={(value) => field.onChange(serializeDateValue(value))}
								showYearPicker
								value={parseDateValue(field.value)}
							/>
						)}
					/>
				</div>
			</div>
		</section>
	)
}

export default KindoraRoleSection
