import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"

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
					<Modal.Header>
						<Modal.Heading>Delete File</Modal.Heading>
					</Modal.Header>
					<Modal.Body>
						<div className="flex flex-col items-center gap-5 px-2 py-2">
							<p className="text-center text-foreground text-sm leading-5">
								This action will permanently delete the attachment and cannot be reversed.
							</p>
							<div className="flex w-full flex-col gap-3">
								<Button className="w-full" variant="danger" isPending={deleteMutation.isPending} onPress={handleDelete}>
									Yes, delete
								</Button>
								<Button fullWidth isDisabled={deleteMutation.isPending} onPress={closeDeleteDocumentModal} size="md">
									Cancel
								</Button>
							</div>
						</div>
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeleteDocumentModal
