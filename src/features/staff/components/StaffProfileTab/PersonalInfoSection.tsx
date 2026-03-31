import {
	Avatar,
	Button,
	Calendar,
	DateField,
	DatePicker,
	FieldError,
	Input,
	Label,
	ListBox,
	Select,
	TextField,
} from "@heroui/react"
import { Controller } from "react-hook-form"

import { formatUSPhone } from "@/utils/format"
import LucideUserRound from "~icons/lucide/user-round"

import { US_STATES } from "../../constants"

import SectionHeader from "./SectionHeader"

import type { DateValue } from "@internationalized/date"
import type { Control, FieldErrors } from "react-hook-form"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface PersonalInfoSectionProps {
	control: Control<StaffProfileFormData>
	errors: FieldErrors<StaffProfileFormData>
	avatarPreview: string | null | undefined
	onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
	onDeletePicture: () => void
	onDateChange: (value: DateValue | null, onChange: (value: string | undefined) => void) => void
	parseDateValue: (value: string | undefined) => DateValue | null
}

const PersonalInfoSection = ({
	control,
	errors,
	avatarPreview,
	onAvatarUpload,
	onDeletePicture,
	onDateChange,
	parseDateValue,
}: PersonalInfoSectionProps) => {
	return (
		<section className="flex flex-col gap-6">
			<SectionHeader icon={<LucideUserRound className="size-5" />} title="Personal info" />
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-3">
					<Avatar className="size-20">
						<Avatar.Image src={avatarPreview ?? undefined} alt="Employee avatar" />
						<Avatar.Fallback />
					</Avatar>
					<div className="flex flex-col gap-3">
						<Button className="cursor-pointer" variant="primary" size="sm">
							Upload Picture
							<input accept="image/*" className="hidden" onChange={onAvatarUpload} type="file" />
						</Button>
						<Button className="shadow-sm" variant="danger" onPress={onDeletePicture} size="sm">
							Delete Picture
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex gap-2">
						<Controller
							control={control}
							name="firstName"
							render={({ field }) => (
								<TextField className="flex-1" isRequired isInvalid={!!errors.firstName} variant="secondary">
									<Label>First name</Label>

									<Input {...field} />

									<FieldError>{errors.firstName?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name="lastName"
							render={({ field }) => (
								<TextField className="flex-1" isRequired isInvalid={!!errors.lastName} variant="secondary">
									<Label>Last name</Label>

									<Input {...field} />

									<FieldError>{errors.lastName?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<TextField className="flex-1" isRequired isInvalid={!!errors.email} variant="secondary">
									<Label>Email</Label>

									<Input {...field} />

									<FieldError>{errors.email?.message}</FieldError>
								</TextField>
							)}
						/>
					</div>
					<div className="flex gap-2">
						<Controller
							control={control}
							name="phone"
							render={({ field }) => (
								<TextField className="flex-1" isInvalid={!!errors.phone} variant="secondary">
									<Label>Phone</Label>

									<Input
										{...field}
										onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
										placeholder="(555) 123-4567"
										type="tel"
									/>

									<FieldError>{errors.phone?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name="birthday"
							render={({ field }) => (
								<DatePicker
									className="flex-1"
									granularity="day"
									onChange={(value) => onDateChange(value, field.onChange)}
									value={parseDateValue(field.value)}
								>
									<Label>Birthday</Label>
									<DateField.Group variant="secondary" fullWidth>
										<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
										<DateField.Suffix>
											<DatePicker.Trigger>
												<DatePicker.TriggerIndicator />
											</DatePicker.Trigger>
										</DateField.Suffix>
									</DateField.Group>
									<DatePicker.Popover>
										<Calendar aria-label="Birthday">
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
						<Controller
							control={control}
							name="enrollDate"
							render={({ field }) => (
								<DatePicker
									className="flex-1"
									granularity="day"
									onChange={(value) => onDateChange(value, field.onChange)}
									value={parseDateValue(field.value)}
								>
									<Label>Enroll date</Label>
									<DateField.Group variant="secondary" fullWidth>
										<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
										<DateField.Suffix>
											<DatePicker.Trigger>
												<DatePicker.TriggerIndicator />
											</DatePicker.Trigger>
										</DateField.Suffix>
									</DateField.Group>
									<DatePicker.Popover>
										<Calendar aria-label="Enroll date">
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
					<div className="flex gap-2">
						<Controller
							control={control}
							name="state"
							render={({ field }) => (
								<Select
									className="flex-1"
									variant="secondary"
									selectedKey={field.value ?? null}
									onSelectionChange={(key) => {
										if (key !== null) field.onChange(String(key))
									}}
								>
									<Label>State</Label>
									<Select.Trigger>
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox>
											{US_STATES.map((s) => (
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
							name="city"
							render={({ field }) => (
								<TextField className="flex-1" variant="secondary">
									<Label>City</Label>

									<Input {...field} />
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name="streetAddress"
							render={({ field }) => (
								<TextField className="flex-1" variant="secondary">
									<Label>Street address</Label>

									<Input {...field} />
								</TextField>
							)}
						/>
					</div>
					<div className="flex gap-2">
						<Controller
							control={control}
							name="zipCode"
							render={({ field }) => (
								<TextField className="flex-1" variant="secondary">
									<Label>ZIP code</Label>

									<Input {...field} />
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name="notes"
							render={({ field }) => (
								<TextField className="flex-1" variant="secondary">
									<Label>Notes</Label>

									<Input {...field} />
								</TextField>
							)}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default PersonalInfoSection
