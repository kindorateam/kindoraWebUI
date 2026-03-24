import { Button, Modal, toast } from "@heroui/react"
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
				toast("Failed to deactivate room", {
					description: getErrorMessage(error),
					variant: "danger",
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
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<div className="flex flex-col items-center gap-2 pb-0">
							<div className="flex size-12 items-center justify-center rounded-full bg-danger-100">
								<TablerAlertTriangle className="size-6 text-danger" />
							</div>
						</div>
					</Modal.Header>
					<Modal.Body className="py-4 text-center">
						<p className="text-default-600">
							Are you sure you want to deactivate <strong>{roomName}</strong>?
						</p>
						<p className="text-default-400 text-sm">You can reactivate this room later from the deactivated list.</p>
					</Modal.Body>
					<Modal.Footer className="flex-col gap-2">
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
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeactivateRoomModal
