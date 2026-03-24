import { Button, DatePicker, type DateValue, Input, Label, ListBox, Modal, Select, toast } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useCallback, useRef, useState } from "react"

import { getErrorMessage } from "@/utils/error"
import TablerFileText from "~icons/tabler/file-text"

import { useUploadStudentDocument } from "../hooks/useStudents"
import { closeAddDocumentModal, isAddDocumentModalOpenAtom } from "../stores/addDocumentModal.store"

const documentTypes = [
	{ key: "birth_certificate", label: "Birth Certificate" },
	{ key: "emergency_authorization", label: "Emergency Authorization" },
	{ key: "immunization_record", label: "Immunization Record" },
	{ key: "medical_form", label: "Medical Form" },
	{ key: "pickup_authorization", label: "Pickup Authorization" },
]

interface Props {
	studentId: string
}

const AddDocumentModal = ({ studentId }: Props) => {
	const isOpen = useAtomValue(isAddDocumentModalOpenAtom)
	const uploadMutation = useUploadStudentDocument()
	const [step, setStep] = useState<1 | 2>(1)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [type, setType] = useState("")
	const [expiryDate, setExpiryDate] = useState<DateValue | null>(null)
	const [notes, setNotes] = useState("")
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = useCallback((file: File) => {
		setUploadedFile(file)
	}, [])

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			handleFileSelect(file)
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
		const file = e.dataTransfer.files?.[0]
		if (file) {
			handleFileSelect(file)
		}
	}

	const handleNext = () => {
		setStep(2)
	}

	const handleBack = () => {
		setStep(1)
	}

	const handleSave = () => {
		if (!uploadedFile || !type) return

		const data: { type: string; expiryDate?: string; notes?: string } = { type }
		if (expiryDate) {
			data.expiryDate = `${expiryDate.year}-${String(expiryDate.month).padStart(2, "0")}-${String(expiryDate.day).padStart(2, "0")}`
		}
		if (notes) data.notes = notes

		uploadMutation.mutate(
			{ studentId, file: uploadedFile, data },
			{
				onSuccess: () => {
					toast.success("Document uploaded", { description: "Document has been uploaded successfully." })
					handleClose()
				},
				onError: (error) => {
					toast.error("Failed to upload document", { description: getErrorMessage(error) })
				},
			},
		)
	}

	const handleClose = () => {
		closeAddDocumentModal()
		resetState()
	}

	const resetState = () => {
		setStep(1)
		setUploadedFile(null)
		setIsDragging(false)
		setType("")
		setExpiryDate(null)
		setNotes("")
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Container>
				<Modal.Dialog className="max-w-sm">
					<Modal.Header>
						<Modal.Heading>Add File</Modal.Heading>
					</Modal.Header>
					<Modal.Body>
						{step === 1 ? (
							<div className="flex flex-col gap-6">
								<input className="hidden" onChange={handleFileInputChange} ref={fileInputRef} type="file" />
								<div className="rounded-xl bg-default-100 p-2 shadow-sm">
									<button
										className={`flex w-full cursor-pointer flex-col items-center gap-4 rounded-lg border border-dashed p-4 transition-colors ${
											isDragging ? "border-primary bg-primary/10" : "border-default-400"
										}`}
										onClick={() => fileInputRef.current?.click()}
										onDragLeave={handleDragLeave}
										onDragOver={handleDragOver}
										onDrop={handleDrop}
										type="button"
									>
										<div className="flex size-16 items-center justify-center rounded-full bg-white">
											<TablerFileText className="size-8 text-primary" />
										</div>
										<div className="flex items-center">
											<span className="text-default-600 text-xs">
												{uploadedFile ? uploadedFile.name : "Drag a document here or\u00A0"}
											</span>
											{!uploadedFile && (
												<span className="font-semibold text-default-600 text-xs">browse to upload</span>
											)}
										</div>
									</button>
								</div>
								<Button color="primary" fullWidth isDisabled={!uploadedFile} onPress={handleNext}>
									Next
								</Button>
							</div>
						) : (
							<div className="flex flex-col gap-6">
								<div className="flex flex-col gap-3">
									<Input
										label={undefined}
										value={uploadedFile?.name ?? ""}
										onValueChange={(val) => {
											if (uploadedFile) {
												const renamed = new File([uploadedFile], val, { type: uploadedFile.type })
												setUploadedFile(renamed)
											}
										}}
									/>
									<Select
										selectedKey={type || null}
										onSelectionChange={(key) => {
											if (key) setType(String(key))
										}}
									>
										<Label>Type</Label>
										<Select.Trigger>
											<Select.Value />
											<Select.Indicator />
										</Select.Trigger>
										<Select.Popover>
											<ListBox>
												{documentTypes.map((documentType) => (
													<ListBox.Item key={documentType.key} id={documentType.key} textValue={documentType.label}>
														{documentType.label}
														<ListBox.ItemIndicator />
													</ListBox.Item>
												))}
											</ListBox>
										</Select.Popover>
									</Select>
									<DatePicker label="Expiration date" value={expiryDate} onChange={setExpiryDate} />
									<Input label="Notes" value={notes} onValueChange={setNotes} />
								</div>
								<div className="flex flex-col gap-3">
									<Button
										color="primary"
										fullWidth
										isDisabled={!type}
										isLoading={uploadMutation.isPending}
										onPress={handleSave}
									>
										Save
									</Button>
									<Button color="default" fullWidth variant="bordered" onPress={handleBack}>
										Back
									</Button>
									<Button color="default" fullWidth variant="bordered" onPress={handleClose}>
										Cancel
									</Button>
								</div>
							</div>
						)}
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

export default AddDocumentModal
