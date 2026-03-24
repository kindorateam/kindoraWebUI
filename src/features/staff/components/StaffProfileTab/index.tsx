import {
	Avatar,
	Button,
	Card,
	Chip,
	DateField,
	FieldError,
	Input,
	Label,
	ListBox,
	Modal,
	Select,
	Spinner,
	TextField,
	toast,
} from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import { formatUSPhone } from "@/utils/format"
import CiSave from "~icons/ci/save"
import EosIconsRoleBindingOutlined from "~icons/eos-icons/role-binding-outlined"
import JamMedical from "~icons/jam/medical"
import LucideUserRound from "~icons/lucide/user-round"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"
import StreamlineUltimateEmergencyCall from "~icons/streamline-ultimate/emergency-call"
import TablerAlertTriangle from "~icons/tabler/alert-triangle"
import TablerCertificate from "~icons/tabler/certificate"
import TablerCloudUpload from "~icons/tabler/cloud-upload"
import TablerTrash from "~icons/tabler/trash"

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
	const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)

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

	const handleCloseDeactivateModal = () => {
		setIsDeactivateModalOpen(false)
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
									toast("Employee updated", {
										description: "Profile has been saved successfully.",
										variant: "success",
									})
								},
								onError: (error) => {
									toast("Profile updated but avatar upload failed", {
										description: getErrorMessage(error),
										variant: "warning",
									})
								},
							},
						)
					} else {
						toast("Employee updated", {
							description: "Profile has been saved successfully.",
							variant: "success",
						})
					}
				},
				onError: (error) => {
					toast("Failed to update employee", {
						description: getErrorMessage(error),
						variant: "danger",
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
				<Card.Content className="flex h-96 items-center justify-center">
					<Spinner size="lg" />
				</Card.Content>
			</Card>
		)
	}

	if (!employee) {
		return (
			<Card>
				<Card.Content className="flex h-96 items-center justify-center">
					<p className="text-default-500">Employee not found</p>
				</Card.Content>
			</Card>
		)
	}

	return (
		<Card className="p-5">
			<Card.Content className="p-0">
				<form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
					{/* Personal Info */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<LucideUserRound className="size-5" />} title="Personal info" />
						<div className="flex flex-col gap-6">
							<div className="flex items-center gap-3">
								<Avatar
									className="size-20 border-4 border-white shadow-md"
									showFallback
									src={avatarPreview ?? undefined}
								/>
								<div className="flex flex-col gap-3">
									<Button className="cursor-pointer" variant="primary" size="sm">
										Upload Picture
										<input accept="image/*" className="hidden" onChange={handleAvatarUpload} type="file" />
									</Button>
									<Button className="shadow-sm" variant="danger" onPress={handleDeletePicture} size="sm">
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
											<DateField
												className="flex-1"
												granularity="day"
												label="Birthday"
												labelPlacement="inside"
												onChange={(value) => handleDateChange(value, field.onChange)}
												value={parseDateValue(field.value)}
												variant="secondary"
											/>
										)}
									/>
									<Controller
										control={control}
										name="enrollDate"
										render={({ field }) => (
											<DateField
												className="flex-1"
												granularity="day"
												label="Enroll date"
												labelPlacement="inside"
												onChange={(value) => handleDateChange(value, field.onChange)}
												value={parseDateValue(field.value)}
												variant="secondary"
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

					{/* Certification */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<TablerCertificate className="size-5" />} title="Certification" />
						<div className="flex gap-2">
							<Controller
								control={control}
								name="degree"
								render={({ field }) => (
									<Select
										className="flex-1"
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
												{DEGREE_OPTIONS.map((d) => (
													<ListBox.Item id={d.key} key={d.key} textValue={d.label}>
														{d.label}
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
								name="certification"
								render={({ field }) => (
									<TextField className="flex-1" variant="secondary">
										<Label>Certification</Label>

										<Input {...field} />
									</TextField>
								)}
							/>
						</div>
					</section>

					{/* Kindora Role & Status */}
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
												selectionMode="multiple"
												selectedKeys={new Set(field.value || [])}
												onSelectionChange={(keys) => {
													field.onChange(Array.from(keys) as string[])
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
										<DateField
											className="flex-1"
											granularity="day"
											label="Hire date"
											labelPlacement="inside"
											onChange={(value) => handleDateChange(value, field.onChange)}
											value={parseDateValue(field.value)}
											variant="secondary"
										/>
									)}
								/>
							</div>
						</div>
					</section>

					{/* Medical Info */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<JamMedical className="size-5" />} title="Medical info" />
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								<div className="flex flex-1 flex-col gap-2">
									<TextField variant="secondary">
										<Label>Allergies</Label>

										<Input
											onChange={(e) => setAllergyInput(e.target.value)}
											onKeyDown={handleAllergyKeyDown}
											placeholder="Type and press Enter"
											value={allergyInput}
										/>
									</TextField>
									{allergies.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{allergies.map((allergy, i) => (
												<Chip
													// biome-ignore lint/suspicious/noArrayIndexKey: allergy strings may repeat
													key={i}
													size="sm"
													variant="soft"
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
										<TextField className="flex-1" variant="secondary">
											<Label>Medications</Label>

											<Input {...field} />
										</TextField>
									)}
								/>
							</div>
							<div className="flex gap-2">
								<Controller
									control={control}
									name="doctorName"
									render={({ field }) => (
										<TextField className="flex-1" variant="secondary">
											<Label>Doctor</Label>

											<Input {...field} />
										</TextField>
									)}
								/>
								<Controller
									control={control}
									name="doctorPhone"
									render={({ field }) => (
										<TextField className="flex-1" isInvalid={!!errors.doctorPhone} variant="secondary">
											<Label>Doctor phone</Label>

											<Input
												{...field}
												onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
												placeholder="(555) 123-4567"
												type="tel"
											/>

											<FieldError>{errors.doctorPhone?.message}</FieldError>
										</TextField>
									)}
								/>
							</div>
						</div>
					</section>

					{/* Emergency Contacts */}
					<section className="flex flex-col gap-6">
						<SectionHeader icon={<StreamlineUltimateEmergencyCall className="size-5" />} title="Emergency contact" />
						<div className="flex flex-col gap-2">
							{emergencyContacts.map((_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: emergency contacts may not have stable ids
								<div key={index} className="flex items-start gap-2">
									<Controller
										control={control}
										name={`emergencyContacts.${index}.name`}
										render={({ field }) => (
											<TextField
												className="flex-1"
												isInvalid={!!errors.emergencyContacts?.[index]?.name}
												variant="secondary"
											>
												<Label>Name</Label>

												<Input {...field} />

												<FieldError>{errors.emergencyContacts?.[index]?.name?.message}</FieldError>
											</TextField>
										)}
									/>
									<Controller
										control={control}
										name={`emergencyContacts.${index}.phone`}
										render={({ field }) => (
											<TextField
												className="flex-1"
												isInvalid={!!errors.emergencyContacts?.[index]?.phone}
												variant="secondary"
											>
												<Label>Phone</Label>

												<Input
													{...field}
													onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
													placeholder="(555) 123-4567"
													type="tel"
												/>

												<FieldError>{errors.emergencyContacts?.[index]?.phone?.message}</FieldError>
											</TextField>
										)}
									/>
									<Controller
										control={control}
										name={`emergencyContacts.${index}.relationshipTo`}
										render={({ field }) => (
											<TextField className="flex-1" variant="secondary">
												<Label>Relationship to staff</Label>

												<Input {...field} />
											</TextField>
										)}
									/>
								</div>
							))}
						</div>
					</section>

					{/* Action Buttons */}
					<div className="flex items-center gap-5">
						<Button
							className="mr-auto text-xs shadow-sm"
							variant="danger"
							onPress={() => setIsDeactivateModalOpen(true)}
							size="md"
							type="button"
						>
							Deactivate Account
						</Button>
						<Button isDisabled={isSaving} onPress={handleCancel} size="md" type="button" variant="outline">
							Cancel
						</Button>
						<Button variant="primary" isDisabled={!hasChanges || !isValid} isPending={isSaving} size="md" type="submit">
							Save Changes
						</Button>
					</div>
				</form>
				<Modal.Backdrop isOpen={isDeactivateModalOpen} onOpenChange={(open) => !open && handleCloseDeactivateModal()}>
					<Modal.Container>
						<Modal.Dialog>
							<Modal.CloseTrigger />
							<Modal.Body>
								<div className="flex flex-col items-center gap-5 px-7 py-8">
									<div className="flex flex-col items-center gap-3 text-center">
										<div className="flex size-12 items-center justify-center rounded-full bg-danger-100">
											<TablerAlertTriangle className="size-6 text-danger" />
										</div>
										<h3 className="font-medium text-xl leading-7">Deactivate Account</h3>
										<p className="text-foreground text-sm leading-5">
											Are you sure you want to deactivate this staff account?
										</p>
									</div>
									<div className="flex w-full flex-col gap-3">
										<Button className="w-full" variant="danger" onPress={handleCloseDeactivateModal}>
											Deactivate
										</Button>
										<Button fullWidth slot="close" size="md">
											Cancel
										</Button>
									</div>
								</div>
							</Modal.Body>
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Card.Content>
		</Card>
	)
}

export default StaffProfileTab
