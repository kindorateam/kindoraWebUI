import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"

import { getErrorMessage } from "@/utils/error"

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
					<Modal.Body>
						<div className="flex flex-col items-center gap-5 px-7 py-8">
							<div className="flex flex-col items-center gap-3 text-center">
								<h3 className="font-medium text-xl leading-7">Delete File</h3>
								<p className="text-foreground text-sm leading-5">
									This action will permanently delete the attachment and cannot be reversed.
								</p>
							</div>
							<div className="flex w-full flex-col gap-3">
								<Button className="w-full" variant="danger" isPending={deleteMutation.isPending} onPress={handleDelete}>
									Yes, delete
								</Button>
								<Button fullWidth isDisabled={deleteMutation.isPending} slot="close" size="md">
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
