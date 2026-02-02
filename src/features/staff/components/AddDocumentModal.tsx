import { Button, DatePicker, Input, Modal, ModalContent, Select, SelectItem } from "@heroui/react"
import { useAtomValue } from "jotai"
import { useCallback, useRef, useState } from "react"

import TablerFileText from "~icons/tabler/file-text"

import { closeAddDocumentModal, isAddDocumentModalOpenAtom } from "../stores/addDocumentModal.store"

const documentTypes = [
	{ key: "background_check", label: "Background Check" },
	{ key: "covid_vaccination", label: "Covid-19 Vaccination" },
	{ key: "cpr_certification", label: "CPR Certification" },
	{ key: "employment_contract", label: "Employment Contract" },
	{ key: "tuberculosis_test", label: "Tuberculosis Test" },
]

export default function AddDocumentModal() {
	const isOpen = useAtomValue(isAddDocumentModalOpenAtom)
	const [step, setStep] = useState<1 | 2>(1)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [type, setType] = useState("")
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
		// TODO: call upload mutation
		handleClose()
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
		setNotes("")
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={(open) => !open && handleClose()} placement="center" size="sm">
			<ModalContent>
				<div className="flex flex-col gap-5 p-5">
					<h3 className="font-medium text-xl leading-7">Add File</h3>
					{step === 1 ? (
						<div className="flex flex-col gap-6">
							<input className="hidden" onChange={handleFileInputChange} ref={fileInputRef} type="file" />
							<div className="rounded-xl bg-default-100 p-2 shadow-sm">
								<button
									className={`flex w-full flex-col items-center gap-4 rounded-lg border border-dashed p-4 transition-colors ${
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
										{!uploadedFile && <span className="font-semibold text-default-600 text-xs">browse to upload</span>}
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
									label="Type"
									size="sm"
									selectedKeys={type ? [type] : []}
									onSelectionChange={(keys) => {
										const selected = Array.from(keys)[0]
										if (selected) setType(String(selected))
									}}
								>
									{documentTypes.map((dt) => (
										<SelectItem key={dt.key}>{dt.label}</SelectItem>
									))}
								</Select>
								<DatePicker label="Expiration date" />
								<Input label="Notes" value={notes} onValueChange={setNotes} />
							</div>
							<div className="flex flex-col gap-3">
								<Button color="primary" fullWidth onPress={handleSave}>
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
				</div>
			</ModalContent>
		</Modal>
	)
}
