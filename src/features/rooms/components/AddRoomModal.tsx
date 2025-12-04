import { Modal, ModalBody, ModalContent } from "@heroui/react"
import { useAtomValue } from "jotai"

import { useCreateRoom } from "../hooks/useRooms"
import { closeAddRoomModal, isAddRoomModalOpenAtom } from "../stores/addRoomModal.store"

import AddRoomStepper from "./AddRoomStepper"

import type { AddRoomFormData } from "../types"

const AddRoomModal = () => {
	const isOpen = useAtomValue(isAddRoomModalOpenAtom)
	const createRoomMutation = useCreateRoom()

	const handleComplete = (data: AddRoomFormData) => {
		createRoomMutation.mutate(data, {
			onSuccess: () => {
				closeAddRoomModal()
			},
			onError: (error) => {
				// TODO: Show error toast
				console.error("Failed to create room:", error)
			},
		})
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
					<AddRoomStepper
						isLoading={createRoomMutation.isPending}
						onCancel={handleCancel}
						onComplete={handleComplete}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default AddRoomModal
