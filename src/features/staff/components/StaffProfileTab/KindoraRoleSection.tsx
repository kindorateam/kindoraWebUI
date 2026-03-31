import { Calendar, Chip, DateField, DatePicker, Label, ListBox, Select } from "@heroui/react"
import { Controller } from "react-hook-form"

import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"

import { MOCK_ROOMS, SIGNUP_STATUS_OPTIONS, STAFF_ROLES } from "../../constants"

import SectionHeader from "./SectionHeader"

import type { DateValue } from "@internationalized/date"
import type { Control, FieldErrors } from "react-hook-form"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface KindoraRoleSectionProps {
	control: Control<StaffProfileFormData>
	errors: FieldErrors<StaffProfileFormData>
	assignedRooms: string[]
	onDateChange: (value: DateValue | null, onChange: (value: string | undefined) => void) => void
	parseDateValue: (value: string | undefined) => DateValue | null
}

const getRoomLabel = (key: string) => MOCK_ROOMS.find((r) => r.key === key)?.label ?? key

const KindoraRoleSection = ({ control, assignedRooms, onDateChange, parseDateValue }: KindoraRoleSectionProps) => {
	return (
		<section className="flex flex-col gap-6">
			<SectionHeader icon={<EosIconsRoleBindingOutlined className="size-5" />} title="Kindora role & status" />
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
								<Label>Sign up status</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{SIGNUP_STATUS_OPTIONS.map((s) => (
											<ListBox.Item id={s.key} key={s.key} textValue={s.label}>
												{s.label}
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
								<Label>Role</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{STAFF_ROLES.map((r) => (
											<ListBox.Item id={r.key} key={r.key} textValue={r.label}>
												{r.label}
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
									<Label>Assigned rooms</Label>
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
							<DatePicker
								className="flex-1"
								granularity="day"
								onChange={(value) => onDateChange(value, field.onChange)}
								value={parseDateValue(field.value)}
							>
								<Label>Hire date</Label>
								<DateField.Group variant="secondary" fullWidth>
									<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
									<DateField.Suffix>
										<DatePicker.Trigger>
											<DatePicker.TriggerIndicator />
										</DatePicker.Trigger>
									</DateField.Suffix>
								</DateField.Group>
								<DatePicker.Popover>
									<Calendar aria-label="Hire date">
										<Calendar.Header>
											<Calendar.YearPickerTrigger>
												<Calendar.YearPickerTriggerHeading />
												<Calendar.YearPickerTriggerIndicator />
											</Calendar.YearPickerTrigger>
											<Calendar.NavButton slot="previous" />
											<Calendar.NavButton slot="next" />
										</Calendar.Header>
										<Calendar.Grid>
											<Calendar.GridHeader>
												{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
											</Calendar.GridHeader>
											<Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
										</Calendar.Grid>
										<Calendar.YearPickerGrid>
											<Calendar.YearPickerGridBody>
												{({ year }) => <Calendar.YearPickerCell year={year} />}
											</Calendar.YearPickerGridBody>
										</Calendar.YearPickerGrid>
									</Calendar>
								</DatePicker.Popover>
							</DatePicker>
						)}
					/>
				</div>
			</div>
		</section>
	)
}

export default KindoraRoleSection
