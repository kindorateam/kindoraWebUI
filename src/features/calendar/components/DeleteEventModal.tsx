import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, addToast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"
import TablerAlertTriangle from "~icons/tabler/alert-triangle"

import { useDeleteEvent } from "../hooks/useCalendar"
import { closeDeleteEventModal, deleteEventModalAtom } from "../stores/deleteEventModal.store"
import { closeEventModal } from "../stores/eventModal.store"

const DeleteEventModal = () => {
	const { isOpen, eventId, eventTitle } = useAtomValue(deleteEventModalAtom)
	const deleteMutation = useDeleteEvent()

	const handleDelete = () => {
		if (!eventId) return

		deleteMutation.mutate(eventId, {
			onSuccess: () => {
				addToast({
					title: "Event deleted",
					color: "success",
				})
				closeDeleteEventModal()
				closeEventModal()
			},
			onError: (error) => {
				addToast({
					title: "Failed to delete event",
					description: getErrorMessage(error),
					color: "danger",
				})
			},
		})
	}

	const handleClose = () => {
		if (!deleteMutation.isPending) {
			deleteMutation.reset()
			closeDeleteEventModal()
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
						Are you sure you want to delete <strong>{eventTitle}</strong>?
					</p>
					<p className="text-default-400 text-sm">This action cannot be undone.</p>
				</ModalBody>
				<ModalFooter className="flex-col gap-2">
					<Button color="danger" fullWidth isLoading={deleteMutation.isPending} onPress={handleDelete} size="md">
						Delete
					</Button>
					<Button color="default" fullWidth isDisabled={deleteMutation.isPending} onPress={handleClose} size="md">
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default DeleteEventModal
