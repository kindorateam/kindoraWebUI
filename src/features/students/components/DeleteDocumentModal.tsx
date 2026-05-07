import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"

import { useDeleteStudentDocument } from "../hooks/useStudents"
import { closeDeleteDocumentModal, deleteDocumentIdAtom } from "../stores/deleteDocumentModal.store"

interface Props {
	studentId: string
}

const DeleteDocumentModal = ({ studentId }: Props) => {
	const { t } = useTranslation()
	const documentId = useAtomValue(deleteDocumentIdAtom)
	const isOpen = documentId !== null
	const deleteMutation = useDeleteStudentDocument()

	const handleDelete = () => {
		if (documentId === null) return
		deleteMutation.mutate(
			{ studentId, documentId },
			{
				onSuccess: () => {
					toast.success(t("students.detail.documents.deleteModal.successTitle"), {
						description: t("students.detail.documents.deleteModal.successDescription"),
					})
					closeDeleteDocumentModal()
				},
				onError: (error) => {
					toast.danger(t("students.detail.documents.deleteModal.errorTitle"), { description: getErrorMessage(error) })
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
						<Modal.Heading>{t("students.detail.documents.deleteModal.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="flex flex-col items-center gap-4">
						<div className="flex size-12 items-center justify-center rounded-full bg-danger/10">
							<MaterialSymbolsDeleteOutline className="size-6 text-danger" />
						</div>
						<p className="text-center text-base">{t("students.detail.documents.deleteModal.description")}</p>
					</Modal.Body>
					<Modal.Footer className="flex flex-col gap-3">
						<Button fullWidth variant="danger" isPending={deleteMutation.isPending} onPress={handleDelete}>
							{t("students.detail.documents.deleteModal.confirm")}
						</Button>
						<Button
							fullWidth
							variant="secondary"
							isDisabled={deleteMutation.isPending}
							onPress={closeDeleteDocumentModal}
						>
							{t("common.cancel")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default DeleteDocumentModal
