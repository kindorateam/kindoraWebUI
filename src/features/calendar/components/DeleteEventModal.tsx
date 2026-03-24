import { Button, Modal, toast } from "@heroui/react"
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
				toast("Event deleted", { variant: "success" })
				closeDeleteEventModal()
				closeEventModal()
			},
			onError: (error) => {
				toast("Failed to delete event", {
					description: getErrorMessage(error),
					variant: "danger",
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
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header className="flex flex-col items-center gap-2 pb-0">
						<div className="flex size-12 items-center justify-center rounded-full bg-danger-100">
							<TablerAlertTriangle className="size-6 text-danger" />
						</div>
					</Modal.Header>
					<Modal.Body className="py-4 text-center">
						<p className="text-default-600">
							Are you sure you want to delete <strong>{eventTitle}</strong>?
						</p>
						<p className="text-default-400 text-sm">This action cannot be undone.</p>
					</Modal.Body>
					<Modal.Footer className="flex-col gap-2">
						<Button variant="danger" fullWidth isPending={deleteMutation.isPending} onPress={handleDelete} size="md">
							Delete
						</Button>
						<Button fullWidth isDisabled={deleteMutation.isPending} onPress={handleClose} size="md">
							Cancel
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeleteEventModal
