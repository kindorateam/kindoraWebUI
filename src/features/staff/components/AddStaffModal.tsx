import { Modal, ModalBody, ModalContent, addToast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { closeAddStaffModal, isAddStaffModalOpenAtom } from "../stores/addStaffModal.store"

import AddStaffStepper from "./AddStaffStepper"

import type { AddStaffFormData } from "../schemas/addStaff.schema"

const AddStaffModal = () => {
	const isOpen = useAtomValue(isAddStaffModalOpenAtom)

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

	return (
		<Modal
			classNames={{ closeButton: "cursor-pointer" }}
			isOpen={isOpen}
			onOpenChange={(open) => !open && closeAddStaffModal()}
			placement="center"
			size="xl"
		>
			<ModalContent>
				<ModalBody className="p-0">
					<AddStaffStepper isLoading={false} onCancel={handleCancel} onComplete={handleComplete} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default AddStaffModal
