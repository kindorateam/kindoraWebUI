import { Modal, toast } from "@heroui/react"
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
								toast("Room created but logo upload failed", {
									description: getErrorMessage(error),
									variant: "warning",
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
				toast("Failed to create room", {
					description: getErrorMessage(error),
					variant: "danger",
				})
			},
		})
	}

	const handleCancel = () => {
		closeAddRoomModal()
	}

	const isLoading = createRoomMutation.isPending || updateLogoMutation.isPending

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeAddRoomModal()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Body className="p-0">
						<AddRoomStepper isPending={isLoading} onCancel={handleCancel} onComplete={handleComplete} />
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default AddRoomModal
