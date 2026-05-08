import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import TablerAlertTriangle from "~icons/tabler/alert-triangle"

import { useDeleteEvent } from "../hooks/useCalendar"
import { closeDeleteEventModal, deleteEventModalAtom } from "../stores/deleteEventModal.store"
import { closeEventModal } from "../stores/eventModal.store"

import type { DeleteEventScope } from "../types"

const DeleteEventModal = () => {
	const { t } = useTranslation()
	const { isOpen, eventId, eventTitle, eventStart, isRepeating } = useAtomValue(deleteEventModalAtom)
	const deleteMutation = useDeleteEvent()

	const handleDelete = (scope: DeleteEventScope = "series") => {
		if (!eventId || (scope === "occurrence" && !eventStart)) return

		deleteMutation.mutate(
			{
				eventId,
				scope,
				occurrenceStart: scope === "occurrence" ? (eventStart ?? undefined) : undefined,
			},
			{
				onSuccess: () => {
					toast(t("calendar.toast.deleted"), { variant: "success" })
					closeDeleteEventModal()
					closeEventModal()
				},
				onError: (error) => {
					toast(t("calendar.toast.deleteFailed"), {
						description: getErrorMessage(error),
						variant: "danger",
					})
				},
			},
		)
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
							{t("calendar.delete.confirmPrefix")} <strong>{eventTitle}</strong>
							{t("calendar.delete.confirmSuffix")}
						</p>
						<p className="text-default-400 text-sm">
							{isRepeating ? t("calendar.delete.repeatingDescription") : t("calendar.delete.description")}
						</p>
					</Modal.Body>
					<Modal.Footer className="flex-col gap-2">
						{isRepeating ? (
							<>
								<Button
									variant="danger"
									fullWidth
									isPending={deleteMutation.isPending}
									onPress={() => handleDelete("occurrence")}
									size="md"
								>
									{t("calendar.delete.deleteOccurrence")}
								</Button>
								<Button
									variant="danger"
									fullWidth
									isDisabled={deleteMutation.isPending}
									onPress={() => handleDelete("series")}
									size="md"
								>
									{t("calendar.delete.deleteSeries")}
								</Button>
							</>
						) : (
							<Button
								variant="danger"
								fullWidth
								isPending={deleteMutation.isPending}
								onPress={() => handleDelete("series")}
								size="md"
							>
								{t("common.delete")}
							</Button>
						)}
						<Button fullWidth isDisabled={deleteMutation.isPending} onPress={handleClose} size="md">
							{t("common.cancel")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeleteEventModal
