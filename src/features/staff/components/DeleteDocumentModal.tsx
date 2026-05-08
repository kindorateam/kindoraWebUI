import { Button, Modal, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"

import { useDeleteEmployeeDocument } from "../hooks/useStaff"
import { closeDeleteDocumentModal, deleteDocumentIdAtom } from "../stores/deleteDocumentModal.store"

interface Props {
	employeeId: string
}

export default function DeleteDocumentModal({ employeeId }: Props) {
	const { t } = useTranslation()
	const documentId = useAtomValue(deleteDocumentIdAtom)
	const isOpen = documentId !== null
	const deleteMutation = useDeleteEmployeeDocument()

	const handleDelete = () => {
		if (documentId === null) return
		deleteMutation.mutate(
			{ employeeId, documentId },
			{
				onSuccess: () => {
					toast(t("staff.documents.deleteModal.successTitle"), {
						description: t("staff.documents.deleteModal.successDescription"),
						variant: "success",
					})
					closeDeleteDocumentModal()
				},
				onError: (error) => {
					toast(t("staff.documents.deleteModal.errorTitle"), { description: getErrorMessage(error), variant: "danger" })
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
						<Modal.Heading>{t("staff.documents.deleteModal.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body className="flex flex-col items-center gap-4">
						<div className="flex size-12 items-center justify-center rounded-full bg-danger/10">
							<MaterialSymbolsDeleteOutline className="size-6 text-danger" />
						</div>
						<p className="text-center text-base">{t("staff.documents.deleteModal.description")}</p>
					</Modal.Body>
					<Modal.Footer className="flex flex-col gap-3">
						<Button fullWidth variant="danger" isPending={deleteMutation.isPending} onPress={handleDelete}>
							{t("staff.documents.deleteModal.confirm")}
						</Button>
						<Button fullWidth variant="secondary" isDisabled={deleteMutation.isPending} slot="close">
							{t("common.cancel")}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}
