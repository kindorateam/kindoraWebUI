import { Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { useCreateRoom } from "../hooks/useRooms"
import { closeAddRoomModal, isAddRoomModalOpenAtom } from "../stores/addRoomModal.store"

import AddRoomStepper from "./AddRoomStepper"

import type { AddRoomFormData } from "../types"

const AddRoomModal = () => {
	const { t } = useTranslation()
	const isOpen = useAtomValue(isAddRoomModalOpenAtom)
	const createRoomMutation = useCreateRoom()

	const handleComplete = (data: AddRoomFormData) => {
		createRoomMutation.mutate(data, {
			onSuccess: () => {
				closeAddRoomModal()
			},
			onError: (error) => {
				toast(t("rooms.addRoom.createError"), {
					description: getErrorMessage(error),
					variant: "danger",
				})
			},
		})
	}

	const handleCancel = () => {
		closeAddRoomModal()
	}

	const isLoading = createRoomMutation.isPending

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeAddRoomModal()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					{isOpen ? (
						<Modal.Body>
							<AddRoomStepper isLoading={isLoading} onCancel={handleCancel} onComplete={handleComplete} />
						</Modal.Body>
					) : null}
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default AddRoomModal
