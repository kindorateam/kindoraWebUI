import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"

import { useDeleteStudentDocument } from "../hooks/useStudents"
import { closeDeleteDocumentModal, deleteDocumentIdAtom } from "../stores/deleteDocumentModal.store"

interface Props {
	studentId: string
}

const DeleteDocumentModal = ({ studentId }: Props) => {
	const documentId = useAtomValue(deleteDocumentIdAtom)
	const isOpen = documentId !== null
	const deleteMutation = useDeleteStudentDocument()

	const handleDelete = () => {
		if (documentId === null) return
		deleteMutation.mutate(
			{ studentId, documentId },
			{
				onSuccess: () => {
					toast.success("Document deleted", { description: "Document has been deleted successfully." })
					closeDeleteDocumentModal()
				},
				onError: (error) => {
					toast.danger("Failed to delete document", { description: getErrorMessage(error) })
				},
			},
		)
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeDeleteDocumentModal()}>
			<Modal.Container>
				<Modal.Dialog className="max-w-sm">
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>Delete File</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="flex flex-col items-center gap-4">
						<div className="flex size-12 items-center justify-center rounded-full bg-danger/10">
							<MaterialSymbolsDeleteOutline className="size-6 text-danger" />
						</div>
						<p className="text-center text-base">
							This action will permanently delete the attachment and cannot be reversed.
						</p>
					</Modal.Body>
					<Modal.Footer className="flex flex-col gap-3">
						<Button fullWidth variant="danger" isPending={deleteMutation.isPending} onPress={handleDelete}>
							Yes, delete
						</Button>
						<Button
							fullWidth
							variant="secondary"
							isDisabled={deleteMutation.isPending}
							onPress={closeDeleteDocumentModal}
						>
							Cancel
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeleteDocumentModal
