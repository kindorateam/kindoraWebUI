import { Avatar, Button, Card, CardBody, Chip, Input, Spinner, addToast } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import TablerCalendar from "~icons/tabler/calendar"
import TablerCertificate from "~icons/tabler/certificate"
import TablerCheck from "~icons/tabler/check"
import TablerCloudUpload from "~icons/tabler/cloud-upload"
import TablerPhone from "~icons/tabler/phone"
import TablerStethoscope from "~icons/tabler/stethoscope"
import TablerTrash from "~icons/tabler/trash"
import TablerUser from "~icons/tabler/user"
import TablerUserCog from "~icons/tabler/user-cog"

import { WORKING_DAYS } from "../../constants"
import { useEmployee, useUpdateEmployee, useUpdateEmployeeAvatar } from "../../hooks/useStaff"
import { staffProfileSchema } from "../../schemas/staffProfile.schema"
import {
	buildDefaultValues,
	buildFormValuesFromEmployee,
	buildPayloadFromFormData,
} from "../../utils/staffProfile.utils"

import SectionHeader from "./SectionHeader"

import type { DayKey } from "../../constants"
import type { StaffProfileFormData } from "../../schemas/staffProfile.schema"

interface StaffProfileTabProps {
	employeeId: string
}

const StaffProfileTab = ({ employeeId }: StaffProfileTabProps) => {
	const { data: employee, isLoading } = useEmployee(employeeId)
	const updateEmployeeMutation = useUpdateEmployee()
	const updateAvatarMutation = useUpdateEmployeeAvatar()

	const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null)

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
	const scheduleValues = watch("schedule")
	const emergencyContacts = watch("emergencyContacts")
	const allergies = watch("allergies") ?? []

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

	const toggleDay = (day: DayKey) => {
		setValue(`schedule.${day}`, !scheduleValues[day], { shouldDirty: true })
	}

	const addEmergencyContact = () => {
		setValue("emergencyContacts", [...emergencyContacts, { name: "", phone: "", relationshipTo: "" }], {
			shouldDirty: true,
		})
	}

	const removeEmergencyContact = (index: number) => {
		setValue(
			"emergencyContacts",
			emergencyContacts.filter((_, i) => i !== index),
			{ shouldDirty: true },
		)
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
											label="Phone"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Controller
									control={control}
									name="birthday"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="Birthday"
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
							<div className="flex gap-2">
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
							</div>
							<div className="flex gap-2">
								<Controller
									control={control}
									name="state"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="State"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
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
									<Input
										{...field}
										className="flex-1"
										label="Degree"
										labelPlacement="inside"
										radius="md"
										variant="flat"
									/>
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
								<Input
									className="flex-1"
									isReadOnly
									label="Sign up status"
									labelPlacement="inside"
									radius="md"
									value={employee.accountStatus ?? employee.status}
									variant="flat"
								/>
								<Controller
									control={control}
									name="role"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											errorMessage={errors.role?.message}
											isInvalid={!!errors.role}
											isRequired
											label="Role"
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
									name="hireDate"
									render={({ field }) => (
										<Input
											{...field}
											className="flex-1"
											label="Hire date"
											labelPlacement="inside"
											radius="md"
											variant="flat"
										/>
									)}
								/>
								<Input
									className="flex-1"
									isReadOnly
									label="Pin"
									labelPlacement="inside"
									radius="md"
									value={employee.pinCode != null ? String(employee.pinCode) : ""}
									variant="flat"
								/>
							</div>
						</div>
					</section>

					{/* Schedule */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerCalendar className="size-4" />} title="Schedule" />
						<div className="flex flex-wrap gap-2">
							{WORKING_DAYS.map(({ key, label }) => (
								<Chip
									classNames={{
										base: `h-8 cursor-pointer px-3 ${scheduleValues[key] ? "bg-primary-50" : "bg-default-100 opacity-50"}`,
										content: "text-sm",
									}}
									key={key}
									size="sm"
									variant="flat"
									onClick={() => toggleDay(key)}
								>
									{label}
								</Chip>
							))}
						</div>
					</section>

					{/* Medical Info */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerStethoscope className="size-4" />} title="Medical info" />
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								<div className="flex flex-1 flex-col gap-2">
									<div className="flex flex-wrap gap-2">
										{allergies.length > 0 ? (
											allergies.map((allergy, i) => (
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
											))
										) : (
											<span className="text-default-500 text-sm">No allergies</span>
										)}
									</div>
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
											label="Doctor phone"
											labelPlacement="inside"
											radius="md"
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
							{emergencyContacts.length > 0 ? (
								emergencyContacts.map((_, index) => (
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
													radius="md"
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
										<Button
											color="danger"
											isIconOnly
											onPress={() => removeEmergencyContact(index)}
											radius="md"
											size="sm"
											variant="light"
										>
											<TablerTrash className="size-4" />
										</Button>
									</div>
								))
							) : (
								<span className="text-default-500 text-sm">No emergency contacts</span>
							)}
							<Button className="w-fit" onPress={addEmergencyContact} radius="md" size="sm" variant="flat">
								Add contact
							</Button>
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
