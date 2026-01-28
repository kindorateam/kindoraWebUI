import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, addToast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"
import TablerAlertTriangle from "~icons/tabler/alert-triangle"

import { useInactivateRoom } from "../hooks/useRooms"
import { closeDeactivateRoomModal, deactivateRoomModalAtom } from "../stores/deactivateRoomModal.store"

interface DeactivateRoomModalProps {
	onSuccess?: () => void
}

const DeactivateRoomModal = ({ onSuccess }: DeactivateRoomModalProps) => {
	const { isOpen, roomId, roomName } = useAtomValue(deactivateRoomModalAtom)
	const inactivateMutation = useInactivateRoom()

	const handleDeactivate = () => {
		if (!roomId) return

		inactivateMutation.mutate(roomId, {
			onSuccess: () => {
				closeDeactivateRoomModal()
				onSuccess?.()
			},
			onError: (error) => {
				addToast({
					title: "Failed to deactivate room",
					description: getErrorMessage(error),
					color: "danger",
				})
			},
		})
	}

	const handleClose = () => {
		if (!inactivateMutation.isPending) {
			inactivateMutation.reset()
			closeDeactivateRoomModal()
		}
	}

	return (
		<Modal
			classNames={{ closeButton: "cursor-pointer" }}
			isOpen={isOpen}
			onOpenChange={(open) => !open && handleClose()}
			placement="center"
			size="sm"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col items-center gap-2 pb-0">
					<div className="flex size-12 items-center justify-center rounded-full bg-danger-100">
						<TablerAlertTriangle className="size-6 text-danger" />
					</div>
				</ModalHeader>
				<ModalBody className="py-4 text-center">
					<p className="text-default-600">
						Are you sure you want to deactivate <strong>{roomName}</strong>?
					</p>
					<p className="text-default-400 text-sm">You can reactivate this room later from the deactivated list.</p>
				</ModalBody>
				<ModalFooter className="flex-col gap-2">
					<Button
						color="danger"
						fullWidth
						isLoading={inactivateMutation.isPending}
						onPress={handleDeactivate}
						size="md"
					>
						Deactivate
					</Button>
					<Button color="default" fullWidth isDisabled={inactivateMutation.isPending} onPress={handleClose} size="md">
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default DeactivateRoomModal
