import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"

import { useInactivateRoom } from "../hooks/useRooms"
import { closeDeactivateRoomModal, deactivateRoomModalAtom } from "../stores/deactivateRoomModal.store"

interface DeactivateRoomModalProps {
	onSuccess?: () => void
}

const DeactivateRoomModal = ({ onSuccess }: DeactivateRoomModalProps) => {
	const { t } = useTranslation()
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
				toast(t("rooms.deactivate.error"), {
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
						<Modal.Heading>{t("rooms.deactivate.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="py-4 text-center">
						<p className="text-base text-default-700">{t("rooms.deactivate.description", { roomName })}</p>
						<p className="text-default-500 text-sm">{t("rooms.deactivate.reactivateHint")}</p>
					</Modal.Body>
					<Modal.Footer className="flex-col gap-2">
						<Button
							variant="danger"
							fullWidth
							isPending={inactivateMutation.isPending}
							onPress={handleDeactivate}
							size="md"
						>
							{t("rooms.deactivate.confirm")}
						</Button>
						<Button
							variant="secondary"
							fullWidth
							isDisabled={inactivateMutation.isPending}
							onPress={handleClose}
							size="md"
						>
							{t("common.cancel")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeactivateRoomModal
