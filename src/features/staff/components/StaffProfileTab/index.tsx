import { Card, Spinner } from "@heroui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useStaffProfileForm } from "../../hooks/useStaffProfileForm"

import CertificationSection from "./CertificationSection"
import DeactivateStaffModal from "./DeactivateStaffModal"
import EmergencyContactSection from "./EmergencyContactSection"
import KindoraRoleSection from "./KindoraRoleSection"
import MedicalInfoSection from "./MedicalInfoSection"
import PersonalInfoSection from "./PersonalInfoSection"
import StaffProfileActions from "./StaffProfileActions"

interface StaffProfileTabProps {
	employeeId: string
}

const StaffProfileTab = ({ employeeId }: StaffProfileTabProps) => {
	const { t } = useTranslation()
	const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
	const {
		allergies,
		assignedRooms,
		avatarPreview,
		control,
		emergencyContacts,
		employee,
		formState: { errors, isValid },
		handleAllergiesChange,
		handleAvatarUpload,
		handleCancel,
		handleDeletePicture,
		handleProfileSubmit,
		handleSubmit,
		hasChanges,
		isLoading,
		isSaving,
	} = useStaffProfileForm(employeeId)

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
					<p className="text-default-500">{t("staff.detail.notFound")}</p>
				</Card.Content>
			</Card>
		)
	}

	return (
		<Card className="p-5 shadow-xl">
			<Card.Content className="p-0">
				<form className="flex flex-col gap-6" onSubmit={handleSubmit(handleProfileSubmit)}>
					<PersonalInfoSection
						avatarPreview={avatarPreview}
						control={control}
						errors={errors}
						onAvatarUpload={handleAvatarUpload}
						onDeletePicture={handleDeletePicture}
					/>
					<CertificationSection control={control} errors={errors} />
					<KindoraRoleSection assignedRooms={assignedRooms} control={control} />
					<MedicalInfoSection
						allergies={allergies}
						control={control}
						errors={errors}
						onAllergiesChange={handleAllergiesChange}
					/>
					<EmergencyContactSection control={control} emergencyContacts={emergencyContacts} errors={errors} />
					<StaffProfileActions
						hasChanges={hasChanges}
						isSaving={isSaving}
						isValid={isValid}
						onCancel={handleCancel}
						onDeactivate={() => setIsDeactivateModalOpen(true)}
					/>
				</form>
				<DeactivateStaffModal isOpen={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} />
			</Card.Content>
		</Card>
	)
}

export default StaffProfileTab
