import { Button, Modal, ModalContent } from "@heroui/react"
import { useAtomValue } from "jotai"

import { closeDeleteDocumentModal, deleteDocumentIdAtom } from "../stores/deleteDocumentModal.store"

export default function DeleteDocumentModal() {
	const documentId = useAtomValue(deleteDocumentIdAtom)
	const isOpen = documentId !== null

	const handleDelete = () => {
		// TODO: call delete mutation
		closeDeleteDocumentModal()
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
						<Button className="w-full" color="danger" onPress={handleDelete}>
							Yes, delete
						</Button>
						<Button color="default" fullWidth onPress={closeDeleteDocumentModal} size="md">
							Cancel
						</Button>
					</div>
				</div>
			</ModalContent>
		</Modal>
	)
}
