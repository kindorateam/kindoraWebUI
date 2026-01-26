import { Modal, ModalBody, ModalContent, addToast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"

import { useCreateRoom, useUpdateRoomLogo } from "../hooks/useRooms"
import { closeAddRoomModal, isAddRoomModalOpenAtom } from "../stores/addRoomModal.store"

import AddRoomStepper from "./AddRoomStepper"

import type { AddRoomFormData } from "../types"

const AddRoomModal = () => {
	const isOpen = useAtomValue(isAddRoomModalOpenAtom)
	const createRoomMutation = useCreateRoom()
	const updateLogoMutation = useUpdateRoomLogo()

	const handleComplete = (data: AddRoomFormData) => {
		createRoomMutation.mutate(data, {
			onSuccess: (room) => {
				// If there's a logo file, upload it after room creation
				if (data.avatarFile) {
					updateLogoMutation.mutate(
						{ roomId: room.id, logoFile: data.avatarFile },
						{
							onSuccess: () => {
								closeAddRoomModal()
							},
							onError: (error) => {
								// Room created but logo upload failed
								addToast({
									title: "Room created but logo upload failed",
									description: getErrorMessage(error),
									color: "warning",
								})
								closeAddRoomModal()
							},
						},
					)
				} else {
					closeAddRoomModal()
				}
			},
			onError: (error) => {
				addToast({
					title: "Failed to create room",
					description: getErrorMessage(error),
					color: "danger",
				})
			},
		})
	}

	const handleCancel = () => {
		closeAddRoomModal()
	}

	const isLoading = createRoomMutation.isPending || updateLogoMutation.isPending

	return (
		<Modal
			classNames={{ closeButton: "cursor-pointer" }}
			isOpen={isOpen}
			onOpenChange={(open) => !open && closeAddRoomModal()}
			placement="center"
			size="md"
		>
			<ModalContent>
				<ModalBody className="p-0">
					<AddRoomStepper isLoading={isLoading} onCancel={handleCancel} onComplete={handleComplete} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default AddRoomModal
