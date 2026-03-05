import {
	Avatar,
	Button,
	Card,
	CardBody,
	Chip,
	DateInput,
	Input,
	Select,
	SelectItem,
	Spinner,
	addToast,
} from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import { formatUSPhone } from "@/utils/format"
import TablerCertificate from "~icons/tabler/certificate"
import TablerCheck from "~icons/tabler/check"
import TablerCloudUpload from "~icons/tabler/cloud-upload"
import TablerPhone from "~icons/tabler/phone"
import TablerStethoscope from "~icons/tabler/stethoscope"
import TablerTrash from "~icons/tabler/trash"
import TablerUser from "~icons/tabler/user"
import TablerUserCog from "~icons/tabler/user-cog"

import { DEGREE_OPTIONS, MOCK_ROOMS, SIGNUP_STATUS_OPTIONS, STAFF_ROLES, US_STATES } from "../../constants"
import { useEmployee, useUpdateEmployee, useUpdateEmployeeAvatar } from "../../hooks/useStaff"
import { staffProfileSchema } from "../../schemas/staffProfile.schema"
import {
	buildDefaultValues,
	buildFormValuesFromEmployee,
	buildPayloadFromFormData,
} from "../../utils/staffProfile.utils"

import SectionHeader from "./SectionHeader"

import type { DateValue } from "@internationalized/date"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface StaffProfileTabProps {
	employeeId: string
}

const StaffProfileTab = ({ employeeId }: StaffProfileTabProps) => {
	const { data: employee, isLoading } = useEmployee(employeeId)
	const updateEmployeeMutation = useUpdateEmployee()
	const updateAvatarMutation = useUpdateEmployeeAvatar()

	const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null)
	const [allergyInput, setAllergyInput] = useState("")

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		trigger,
		formState: { errors, isDirty, isValid },
	} = useForm<StaffProfileFormData>({
		resolver: zodResolver(staffProfileSchema),
		mode: "onChange",
		defaultValues: buildDefaultValues(),
	})

	const avatarPreview = watch("avatarPreview")
	const avatarFile = watch("avatarFile")
	const emergencyContacts = watch("emergencyContacts")
	const allergies = watch("allergies") ?? []
	const assignedRooms = watch("assignedRooms") ?? []

	// Sync form state when employee data loads
	useEffect(() => {
		if (employee) {
			reset(buildFormValuesFromEmployee(employee))
			void trigger()
		}
	}, [employee, reset, trigger])

	// Clean up object URLs on unmount
	useEffect(() => {
		return () => {
			if (avatarFileUrl) URL.revokeObjectURL(avatarFileUrl)
		}
	}, [avatarFileUrl])

	const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (avatarFileUrl) URL.revokeObjectURL(avatarFileUrl)
		const url = URL.createObjectURL(file)
		setAvatarFileUrl(url)
		setValue("avatarFile", file, { shouldDirty: true })
		setValue("avatarPreview", url, { shouldDirty: true })
	}

	const handleDeletePicture = () => {
		if (avatarFileUrl) URL.revokeObjectURL(avatarFileUrl)
		setAvatarFileUrl(null)
		setValue("avatarPreview", null, { shouldDirty: true })
		setValue("avatarFile", null, { shouldDirty: true })
	}

	const handleCancel = () => {
		if (employee) {
			if (avatarFileUrl) URL.revokeObjectURL(avatarFileUrl)
			setAvatarFileUrl(null)
			reset(buildFormValuesFromEmployee(employee))
		}
	}

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

	const handleRemoveRoom = (roomKey: string) => {
		setValue(
			"assignedRooms",
			assignedRooms.filter((r) => r !== roomKey),
			{ shouldDirty: true },
		)
	}

	const getRoomLabel = (key: string) => MOCK_ROOMS.find((r) => r.key === key)?.label ?? key

	const handleAddAllergy = () => {
		const trimmed = allergyInput.trim()
		if (trimmed && !allergies.includes(trimmed)) {
			setValue("allergies", [...allergies, trimmed], { shouldDirty: true })
		}
		setAllergyInput("")
	}

	const handleAllergyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			handleAddAllergy()
		}
	}

	const onSubmit = (data: StaffProfileFormData) => {
		const payload = buildPayloadFromFormData(data)

		updateEmployeeMutation.mutate(
			{ employeeId, payload },
			{
				onSuccess: () => {
					if (data.avatarFile) {
						updateAvatarMutation.mutate(
							{ employeeId, avatarFile: data.avatarFile },
							{
								onSuccess: () => {
									setValue("avatarFile", null)
									if (avatarFileUrl) URL.revokeObjectURL(avatarFileUrl)
									setAvatarFileUrl(null)
									addToast({
										title: "Employee updated",
										description: "Profile has been saved successfully.",
										color: "success",
									})
								},
								onError: (error) => {
									addToast({
										title: "Profile updated but avatar upload failed",
										description: getErrorMessage(error),
										color: "warning",
									})
								},
							},
						)
					} else {
						addToast({
							title: "Employee updated",
							description: "Profile has been saved successfully.",
							color: "success",
						})
					}
				},
				onError: (error) => {
					addToast({
						title: "Failed to update employee",
						description: getErrorMessage(error),
						color: "danger",
					})
				},
			},
		)
	}

	const isSaving = updateEmployeeMutation.isPending || updateAvatarMutation.isPending
	const hasChanges = isDirty || !!avatarFile

	if (isLoading) {
		return (
			<Card>
				<CardBody className="flex h-96 items-center justify-center">
					<Spinner size="lg" />
				</CardBody>
			</Card>
		)
	}

	if (!employee) {
		return (
			<Card>
				<CardBody className="flex h-96 items-center justify-center">
					<p className="text-default-500">Employee not found</p>
				</CardBody>
			</Card>
		)
	}

	return (
		<Card className="p-5" radius="md">
			<CardBody className="p-0">
				<form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
					{/* Personal Info */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerUser className="size-4" />} title="Personal info" />
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								<Controller
									control={control}
									name="firstName"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											errorMessage={errors.firstName?.message}
											isInvalid={!!errors.firstName}
											isRequired
											label="First name"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="lastName"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											errorMessage={errors.lastName?.message}
											isInvalid={!!errors.lastName}
											isRequired
											label="Last name"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="email"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											errorMessage={errors.email?.message}
											isInvalid={!!errors.email}
											isRequired
											label="Email"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
							</div>
							<div className="flex gap-2">
								<Controller
									control={control}
									name="phone"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											errorMessage={errors.phone?.message}
											isInvalid={!!errors.phone}
											label="Phone"
											labelPlacement="inside"
											onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
											placeholder="(555) 123-4567"
											radius="md"
											type="tel"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="birthday"
									render={({ field }) => (
										<DateInput
											className="flex-1"
											granularity="day"
											label="Birthday"
											labelPlacement="inside"
											onChange={(value) => handleDateChange(value, field.onChange)}
											radius="md"
											value={parseDateValue(field.value)}
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="enrollDate"
									render={({ field }) => (
										<DateInput
											className="flex-1"
											granularity="day"
											label="Enroll date"
											labelPlacement="inside"
											onChange={(value) => handleDateChange(value, field.onChange)}
											radius="md"
											value={parseDateValue(field.value)}
											variant="flat"
										/>
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
											label="State"
											labelPlacement="inside"
											onSelectionChange={(keys) => {
												const selected = Array.from(keys)[0]
												if (selected !== undefined) {
													field.onChange(String(selected))
												}
											}}
											radius="md"
											selectedKeys={field.value ? [field.value] : []}
											variant="flat"
										>
											{US_STATES.map((s) => (
												<SelectItem key={s.key}>{s.label}</SelectItem>
											))}
										</Select>
									)}
								/>
								<Controller
									control={control}
									name="city"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="City"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="streetAddress"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="Street address"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
							</div>
							<div className="flex gap-2">
								<Controller
									control={control}
									name="zipCode"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="ZIP code"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="notes"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="Notes"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
							</div>
						</div>
					</section>

					{/* Certification */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerCertificate className="size-4" />} title="Certification" />
						<div className="flex gap-2">
							<Controller
								control={control}
								name="degree"
								render={({ field }) => (
									<Select
										className="flex-1"
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
										variant="flat"
									>
										{DEGREE_OPTIONS.map((d) => (
											<SelectItem key={d.key}>{d.label}</SelectItem>
										))}
									</Select>
								)}
							/>
							<Controller
								control={control}
								name="certification"
								render={({ field }) => (
									<Input
										{...field}
										className="flex-1"
										label="Certification"
										labelPlacement="inside"
										radius="md"
										variant="flat"
									/>
								)}
							/>
						</div>
					</section>

					{/* Kindora Role & Status */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerUserCog className="size-4" />} title="Kindora role & status" />
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								<Controller
									control={control}
									name="signUpStatus"
									render={({ field }) => (
										<Select
											className="flex-1"
											isDisabled
											label="Sign up status"
											labelPlacement="inside"
											onSelectionChange={(keys) => {
												const selected = Array.from(keys)[0]
												if (selected !== undefined) {
													field.onChange(String(selected))
												}
											}}
											radius="md"
											selectedKeys={field.value ? [field.value] : []}
											variant="flat"
										>
											{SIGNUP_STATUS_OPTIONS.map((s) => (
												<SelectItem key={s.key}>{s.label}</SelectItem>
											))}
										</Select>
									)}
								/>
								<Controller
									control={control}
									name="role"
									render={({ field }) => (
										<Select
											className="flex-1"
											errorMessage={errors.role?.message}
											isInvalid={!!errors.role}
											isRequired
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
											variant="flat"
										>
											{STAFF_ROLES.map((r) => (
												<SelectItem key={r.key}>{r.label}</SelectItem>
											))}
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
												label="Assigned rooms"
												labelPlacement="inside"
												onSelectionChange={(keys) => {
													field.onChange(Array.from(keys) as string[])
												}}
												radius="md"
												selectedKeys={new Set(field.value || [])}
												selectionMode="multiple"
												variant="flat"
											>
												{MOCK_ROOMS.map((room) => (
													<SelectItem key={room.key}>{room.label}</SelectItem>
												))}
											</Select>
											{assignedRooms.length > 0 && (
												<div className="flex flex-wrap gap-2">
													{assignedRooms.map((roomKey) => (
														<Chip
															classNames={{ base: "h-8 bg-primary-50 px-3", content: "text-sm" }}
															key={roomKey}
															onClose={() => handleRemoveRoom(roomKey)}
															size="sm"
															variant="flat"
														>
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
										<DateInput
											className="flex-1"
											granularity="day"
											label="Hire date"
											labelPlacement="inside"
											onChange={(value) => handleDateChange(value, field.onChange)}
											radius="md"
											value={parseDateValue(field.value)}
											variant="flat"
										/>
									)}
								/>
							</div>
						</div>
					</section>

					{/* Medical Info */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerStethoscope className="size-4" />} title="Medical info" />
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								<div className="flex flex-1 flex-col gap-2">
									<Input
										label="Allergies"
										labelPlacement="inside"
										onChange={(e) => setAllergyInput(e.target.value)}
										onKeyDown={handleAllergyKeyDown}
										placeholder="Type and press Enter"
										radius="md"
										value={allergyInput}
										variant="flat"
									/>
									{allergies.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{allergies.map((allergy, i) => (
												<Chip
													classNames={{ base: "h-8 bg-primary-50 px-3", content: "text-sm" }}
													// biome-ignore lint/suspicious/noArrayIndexKey: allergy strings may repeat
													key={i}
													onClose={() => {
														const updated = allergies.filter((_, idx) => idx !== i)
														setValue("allergies", updated, { shouldDirty: true })
													}}
													size="sm"
													variant="flat"
												>
													{allergy}
												</Chip>
											))}
										</div>
									)}
								</div>
								<Controller
									control={control}
									name="medications"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="Medications"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
							</div>
							<div className="flex gap-2">
								<Controller
									control={control}
									name="doctorName"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="Doctor"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="doctorPhone"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											errorMessage={errors.doctorPhone?.message}
											isInvalid={!!errors.doctorPhone}
											label="Doctor phone"
											labelPlacement="inside"
											onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
											placeholder="(555) 123-4567"
											radius="md"
											type="tel"
											variant="flat"
										/>
									)}
								/>
							</div>
						</div>
					</section>

					{/* Emergency Contacts */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerPhone className="size-4" />} title="Emergency contact" />
						<div className="flex flex-col gap-2">
							{emergencyContacts.map((_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: emergency contacts may not have stable ids
								<div key={index} className="flex items-start gap-2">
									<Controller
										control={control}
										name={`emergencyContacts.${index}.name`}
										render={({ field }) => (
											<Input
												{...field}
												className="flex-1"
												errorMessage={errors.emergencyContacts?.[index]?.name?.message}
												isInvalid={!!errors.emergencyContacts?.[index]?.name}
												label="Name"
												labelPlacement="inside"
												radius="md"
												variant="flat"
											/>
										)}
									/>
									<Controller
										control={control}
										name={`emergencyContacts.${index}.phone`}
										render={({ field }) => (
											<Input
												{...field}
												className="flex-1"
												errorMessage={errors.emergencyContacts?.[index]?.phone?.message}
												isInvalid={!!errors.emergencyContacts?.[index]?.phone}
												label="Phone"
												labelPlacement="inside"
												onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
												placeholder="(555) 123-4567"
												radius="md"
												type="tel"
												variant="flat"
											/>
										)}
									/>
									<Controller
										control={control}
										name={`emergencyContacts.${index}.relationshipTo`}
										render={({ field }) => (
											<Input
												{...field}
												className="flex-1"
												label="Relationship to staff"
												labelPlacement="inside"
												radius="md"
												variant="flat"
											/>
										)}
									/>
								</div>
							))}
						</div>
					</section>

					{/* Profile Picture */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerUser className="size-4" />} title="Profile picture" />
						<div className="flex items-center gap-3">
							<Avatar
								className="size-20 border-4 border-white shadow-md"
								showFallback
								src={avatarPreview ?? undefined}
							/>
							<div className="flex gap-5">
								<Button
									as="label"
									className="cursor-pointer"
									color="primary"
									endContent={<TablerCloudUpload className="size-5" />}
									radius="md"
									size="sm"
								>
									Upload Picture
									<input accept="image/*" className="hidden" onChange={handleAvatarUpload} type="file" />
								</Button>
								<Button
									className="shadow-sm"
									color="danger"
									endContent={<TablerTrash className="size-5" />}
									onPress={handleDeletePicture}
									radius="md"
									size="sm"
									variant="bordered"
								>
									Delete Picture
								</Button>
							</div>
						</div>
					</section>

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-5">
						<Button isDisabled={isSaving} onPress={handleCancel} radius="md" size="md" type="button" variant="bordered">
							Cancel
						</Button>
						<Button
							color="primary"
							endContent={!isSaving && <TablerCheck className="size-5" />}
							isDisabled={!hasChanges || !isValid}
							isLoading={isSaving}
							radius="md"
							size="md"
							type="submit"
						>
							Save Changes
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	)
}

export default StaffProfileTab
