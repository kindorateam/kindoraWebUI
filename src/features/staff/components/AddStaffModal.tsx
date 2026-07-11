import { Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { closeAddStaffModal, isAddStaffModalOpenAtom } from "../stores/addStaffModal.store"

import AddStaffStepper from "./AddStaffStepper"

import type { AddStaffFormData } from "../schemas/addStaff.schema"

const AddStaffModal = () => {
	const { t } = useTranslation()
	const isOpen = useAtomValue(isAddStaffModalOpenAtom)
	const [isLastStep, setIsLastStep] = useState(false)

	const handleComplete = (data: AddStaffFormData) => {
		// TODO: Implement API call to create staff
		console.log("Staff data:", data)
		toast(t("staff.addStaff.notImplementedTitle"), {
			description: t("staff.addStaff.notImplementedDescription"),
			variant: "warning",
		})
		closeAddStaffModal()
	}

	const handleCancel = () => {
		closeAddStaffModal()
	}

	const handleStepChange = (step: number, totalSteps: number) => {
		setIsLastStep(step === totalSteps - 1)
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeAddStaffModal()}>
			<Modal.Container className={isLastStep ? "max-w-4xl" : "max-w-xl"}>
				<Modal.Dialog aria-label={t("staff.addStaff.title")}>
					<Modal.CloseTrigger />
					{isOpen ? (
						<Modal.Body className="p-0">
							<AddStaffStepper
								isLoading={false}
								onCancel={handleCancel}
								onComplete={handleComplete}
								onStepChange={handleStepChange}
							/>
						</Modal.Body>
					) : null}
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default AddStaffModal
