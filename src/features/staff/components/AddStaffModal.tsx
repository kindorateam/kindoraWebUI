import { Modal, ModalBody, ModalContent, addToast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useState } from "react"

import { closeAddStaffModal, isAddStaffModalOpenAtom } from "../stores/addStaffModal.store"

import AddStaffStepper from "./AddStaffStepper"

import type { AddStaffFormData } from "../schemas/addStaff.schema"

const AddStaffModal = () => {
	const isOpen = useAtomValue(isAddStaffModalOpenAtom)
	const [isLastStep, setIsLastStep] = useState(false)

	const handleComplete = (data: AddStaffFormData) => {
		// TODO: Implement API call to create staff
		console.log("Staff data:", data)
		addToast({
			title: "Staff creation not implemented yet",
			description: "This feature is coming soon",
			color: "warning",
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
		<Modal
			classNames={{ closeButton: "cursor-pointer" }}
			isOpen={isOpen}
			onOpenChange={(open) => !open && closeAddStaffModal()}
			placement="center"
			scrollBehavior="outside"
			size={isLastStep ? "4xl" : "xl"}
		>
			<ModalContent>
				<ModalBody className="p-0">
					<AddStaffStepper
						isLoading={false}
						onCancel={handleCancel}
						onComplete={handleComplete}
						onStepChange={handleStepChange}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default AddStaffModal
