import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"

import { useDeleteEmployeeDocument } from "../hooks/useStaff"
import { closeDeleteDocumentModal, deleteDocumentIdAtom } from "../stores/deleteDocumentModal.store"

interface Props {
	employeeId: string
}

export default function DeleteDocumentModal({ employeeId }: Props) {
	const documentId = useAtomValue(deleteDocumentIdAtom)
	const isOpen = documentId !== null
	const deleteMutation = useDeleteEmployeeDocument()

	const handleDelete = () => {
		if (documentId === null) return
		deleteMutation.mutate(
			{ employeeId, documentId },
			{
				onSuccess: () => {
					toast("Document deleted", {
						description: "Document has been deleted successfully.",
						variant: "success",
					})
					closeDeleteDocumentModal()
				},
				onError: (error) => {
					toast("Failed to delete document", { description: getErrorMessage(error), variant: "danger" })
				},
			},
		)
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && closeDeleteDocumentModal()}>
			<Modal.Container>
				<Modal.Dialog>
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
						<Button fullWidth variant="secondary" isDisabled={deleteMutation.isPending} slot="close">
							Cancel
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}
