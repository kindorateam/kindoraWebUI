import { Button, Modal, ModalContent, addToast } from "@heroui/react"
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
					addToast({
						title: "Document deleted",
						description: "Document has been deleted successfully.",
						color: "success",
					})
					closeDeleteDocumentModal()
				},
				onError: (error) => {
					addToast({ title: "Failed to delete document", description: getErrorMessage(error), color: "danger" })
				},
			},
		)
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={(open) => !open && closeDeleteDocumentModal()} placement="center" size="sm">
			<ModalContent>
				<div className="flex flex-col items-center gap-5 px-7 py-8">
					<div className="flex flex-col items-center gap-3 text-center">
						<h3 className="font-medium text-xl leading-7">Delete File</h3>
						<p className="text-foreground text-sm leading-5">
							This action will permanently delete the attachment and cannot be reversed.
						</p>
					</div>
					<div className="flex w-full flex-col gap-3">
						<Button className="w-full" color="danger" isLoading={deleteMutation.isPending} onPress={handleDelete}>
							Yes, delete
						</Button>
						<Button
							color="default"
							fullWidth
							isDisabled={deleteMutation.isPending}
							onPress={closeDeleteDocumentModal}
							size="md"
						>
							Cancel
						</Button>
					</div>
				</div>
			</ModalContent>
		</Modal>
	)
}

export default DeleteDocumentModal
