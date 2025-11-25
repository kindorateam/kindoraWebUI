import { Modal, ModalBody, ModalContent } from "@heroui/react"
import { useAtomValue } from "jotai"

import { closeAddRoomModal, isAddRoomModalOpenAtom } from "../stores/addRoomModal.store"

import AddRoomStepper from "./AddRoomStepper"

import type { AddRoomFormData } from "../types"

const AddRoomModal = () => {
	const isOpen = useAtomValue(isAddRoomModalOpenAtom)

	const handleComplete = (data: AddRoomFormData) => {
		// TODO: Call API to create room
		console.log("Room created:", data)
		closeAddRoomModal()
	}

	const handleCancel = () => {
		closeAddRoomModal()
	}

	return (
		<Modal
			hideCloseButton
			isOpen={isOpen}
			onOpenChange={(open) => !open && closeAddRoomModal()}
			placement="center"
			size="md"
		>
			<ModalContent>
				<ModalBody className="p-0">
					<AddRoomStepper onCancel={handleCancel} onComplete={handleComplete} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default AddRoomModal
