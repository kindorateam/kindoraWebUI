import { Button, Card, Modal, Spinner, toast } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { getErrorMessage } from "@/utils/error"
import CiSave from "~icons/ci/save"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"
import TablerAlertTriangle from "~icons/tabler/alert-triangle"

import { useEmployee, useUpdateEmployee, useUpdateEmployeeAvatar } from "../../hooks/useStaff"
import { staffProfileSchema } from "../../schemas/staffProfile.schema"
import {
	buildDefaultValues,
	buildFormValuesFromEmployee,
	buildPayloadFromFormData,
} from "../../utils/staffProfile.utils"

import CertificationSection from "./CertificationSection"
import EmergencyContactSection from "./EmergencyContactSection"
import KindoraRoleSection from "./KindoraRoleSection"
import MedicalInfoSection from "./MedicalInfoSection"
import PersonalInfoSection from "./PersonalInfoSection"

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

	const handleAllergiesChange = (newAllergies: string[]) => {
		setValue("allergies", newAllergies, { shouldDirty: true })
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
		<Card className="p-5 shadow-xl">
			<Card.Content className="p-0">
				<form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
					<PersonalInfoSection
						control={control}
						errors={errors}
						avatarPreview={avatarPreview}
						onAvatarUpload={handleAvatarUpload}
						onDeletePicture={handleDeletePicture}
						onDateChange={handleDateChange}
						parseDateValue={parseDateValue}
					/>

					<CertificationSection control={control} errors={errors} />

					<KindoraRoleSection
						control={control}
						errors={errors}
						assignedRooms={assignedRooms}
						onDateChange={handleDateChange}
						parseDateValue={parseDateValue}
					/>

					<MedicalInfoSection
						control={control}
						errors={errors}
						allergies={allergies}
						onAllergiesChange={handleAllergiesChange}
					/>

					<EmergencyContactSection control={control} errors={errors} emergencyContacts={emergencyContacts} />

					{/* Action Buttons */}
					<div className="flex items-center gap-5">
						<Button
							className="mr-auto text-xs shadow-sm"
							variant="danger"
							onPress={() => setIsDeactivateModalOpen(true)}
							size="md"
							type="button"
						>
							<MaterialSymbolsDeleteOutline aria-hidden className="size-4" />
							Deactivate Account
						</Button>
						<Button isDisabled={isSaving} onPress={handleCancel} size="md" type="button" variant="outline">
							Cancel
						</Button>
						<Button variant="primary" isDisabled={!hasChanges || !isValid} isPending={isSaving} size="md" type="submit">
							<CiSave aria-hidden className="size-4" />
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
