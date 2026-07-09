import { toast } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { createStaffProfileSchema } from "../schemas/staffProfile.schema"
import { buildDefaultValues, buildFormValuesFromEmployee, buildPayloadFromFormData } from "../utils/staffProfile.utils"

import { useEmployee, useUpdateEmployee, useUpdateEmployeeAvatar } from "./useStaff"

import type { StaffProfileFormData } from "../schemas/staffProfile.schema"

export const useStaffProfileForm = (employeeId: string) => {
	const { t } = useTranslation()
	const { data: employee, isLoading } = useEmployee(employeeId)
	const updateEmployeeMutation = useUpdateEmployee()
	const updateAvatarMutation = useUpdateEmployeeAvatar()
	const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null)

	const form = useForm<StaffProfileFormData>({
		resolver: zodResolver(createStaffProfileSchema(t)),
		mode: "onChange",
		defaultValues: buildDefaultValues(),
	})

	const { reset, setValue, trigger, watch } = form

	useEffect(() => {
		if (!employee) return
		reset(buildFormValuesFromEmployee(employee))
		void trigger()
	}, [employee, reset, trigger])

	useEffect(
		() => () => {
			if (avatarFileUrl) URL.revokeObjectURL(avatarFileUrl)
		},
		[avatarFileUrl],
	)

	const clearLocalAvatar = () => {
		if (avatarFileUrl) URL.revokeObjectURL(avatarFileUrl)
		setAvatarFileUrl(null)
	}

	const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		clearLocalAvatar()
		const url = URL.createObjectURL(file)
		setAvatarFileUrl(url)
		setValue("avatarFile", file, { shouldDirty: true })
		setValue("avatarPreview", url, { shouldDirty: true })
	}

	const handleDeletePicture = () => {
		clearLocalAvatar()
		setValue("avatarPreview", null, { shouldDirty: true })
		setValue("avatarFile", null, { shouldDirty: true })
	}

	const handleCancel = () => {
		if (!employee) return
		clearLocalAvatar()
		reset(buildFormValuesFromEmployee(employee))
	}

	const handleAllergiesChange = (allergies: string[]) => {
		setValue("allergies", allergies, { shouldDirty: true })
	}

	const showUpdateSuccess = () => {
		toast(t("staff.profile.updateSuccess"), {
			description: t("staff.profile.updateSuccessDescription"),
			variant: "success",
		})
	}

	const handleSubmit = (data: StaffProfileFormData) => {
		updateEmployeeMutation.mutate(
			{ employeeId, payload: buildPayloadFromFormData(data) },
			{
				onSuccess: () => {
					if (!data.avatarFile) {
						showUpdateSuccess()
						return
					}

					updateAvatarMutation.mutate(
						{ employeeId, avatarFile: data.avatarFile },
						{
							onSuccess: () => {
								setValue("avatarFile", null)
								clearLocalAvatar()
								showUpdateSuccess()
							},
							onError: (error) => {
								toast(t("staff.profile.avatarUploadFailed"), {
									description: getErrorMessage(error),
									variant: "warning",
								})
							},
						},
					)
				},
				onError: (error) => {
					toast(t("staff.profile.updateError"), {
						description: getErrorMessage(error),
						variant: "danger",
					})
				},
			},
		)
	}

	const avatarFile = watch("avatarFile")

	return {
		...form,
		allergies: watch("allergies") ?? [],
		assignedRooms: watch("assignedRooms") ?? [],
		avatarPreview: watch("avatarPreview"),
		emergencyContacts: watch("emergencyContacts"),
		employee,
		handleAllergiesChange,
		handleAvatarUpload,
		handleCancel,
		handleDeletePicture,
		handleProfileSubmit: handleSubmit,
		hasChanges: form.formState.isDirty || !!avatarFile,
		isLoading,
		isSaving: updateEmployeeMutation.isPending || updateAvatarMutation.isPending,
	}
}
