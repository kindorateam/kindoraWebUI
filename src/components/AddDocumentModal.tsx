import { Modal, toast } from "@heroui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import DocumentDetailsStep from "@/components/documents/DocumentDetailsStep"
import DocumentUploadStep from "@/components/documents/DocumentUploadStep"
import { useFileDrop } from "@/hooks/useFileDrop"
import { serializeDateValue } from "@/utils/date"
import { getErrorMessage } from "@/utils/error"

import type { DateValue } from "@internationalized/date"
import type { DocumentTypeOption, DocumentUploadData } from "@/components/documents/types"

interface AddDocumentModalProps {
	documentTypes: DocumentTypeOption[]
	isOpen: boolean
	isPending: boolean
	onClose: () => void
	onUpload: (
		file: File,
		data: DocumentUploadData,
		callbacks: { onSuccess: () => void; onError: (error: Error) => void },
	) => void
}

const AddDocumentModal = ({ isOpen, onClose, documentTypes, onUpload, isPending }: AddDocumentModalProps) => {
	const { t } = useTranslation()
	const [step, setStep] = useState<1 | 2>(1)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [type, setType] = useState("")
	const [expiryDate, setExpiryDate] = useState<DateValue | null>(null)
	const [notes, setNotes] = useState("")
	const {
		fileInputRef,
		handleDragLeave,
		handleDragOver,
		handleDrop,
		handleFileInputChange,
		isDragging,
		openFilePicker,
		resetFileInput,
	} = useFileDrop(setUploadedFile)

	const resetState = () => {
		setStep(1)
		setUploadedFile(null)
		setType("")
		setExpiryDate(null)
		setNotes("")
		resetFileInput()
	}

	const handleClose = () => {
		onClose()
		resetState()
	}

	const handleRemoveFile = () => {
		setUploadedFile(null)
		resetFileInput()
	}

	const handleSave = () => {
		if (!uploadedFile || !type) return

		const data: DocumentUploadData = { type }
		const serializedExpiryDate = serializeDateValue(expiryDate)
		if (serializedExpiryDate) data.expiryDate = serializedExpiryDate
		if (notes) data.notes = notes

		onUpload(uploadedFile, data, {
			onSuccess: () => {
				toast(t("addDocumentModal.successTitle"), {
					description: t("addDocumentModal.successDescription"),
					variant: "success",
				})
				handleClose()
			},
			onError: (error) => {
				toast(t("addDocumentModal.errorTitle"), { description: getErrorMessage(error), variant: "danger" })
			},
		})
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog className="max-w-sm">
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{t("addDocumentModal.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body>
						{step === 1 || !uploadedFile ? (
							<DocumentUploadStep
								file={uploadedFile}
								fileInputRef={fileInputRef}
								isDragging={isDragging}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								onFileInputChange={handleFileInputChange}
								onNext={() => setStep(2)}
								onOpenFilePicker={openFilePicker}
								onRemoveFile={handleRemoveFile}
							/>
						) : (
							<DocumentDetailsStep
								documentTypes={documentTypes}
								expiryDate={expiryDate}
								file={uploadedFile}
								isPending={isPending}
								notes={notes}
								onBack={() => setStep(1)}
								onCancel={handleClose}
								onExpiryDateChange={setExpiryDate}
								onFileChange={setUploadedFile}
								onNotesChange={setNotes}
								onSave={handleSave}
								onTypeChange={setType}
								type={type}
							/>
						)}
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default AddDocumentModal
