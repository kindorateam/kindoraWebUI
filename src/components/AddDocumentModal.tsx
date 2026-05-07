import {
	Button,
	Calendar,
	DateField,
	DatePicker,
	type DateValue,
	Input,
	Label,
	ListBox,
	Modal,
	Select,
	TextField,
	toast,
} from "@heroui/react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { getErrorMessage } from "@/utils/error"
import TablerFileText from "~icons/tabler/file-text"

interface DocumentType {
	key: string
	label: string
	labelKey?: string
}

type DocumentData = { type: string; expiryDate?: string; notes?: string }

interface Props {
	isOpen: boolean
	onClose: () => void
	documentTypes: DocumentType[]
	onUpload: (
		file: File,
		data: DocumentData,
		callbacks: { onSuccess: () => void; onError: (error: Error) => void },
	) => void
	isPending: boolean
}

const AddDocumentModal = ({ isOpen, onClose, documentTypes, onUpload, isPending }: Props) => {
	const { t } = useTranslation()
	const [step, setStep] = useState<1 | 2>(1)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [type, setType] = useState("")
	const [expiryDate, setExpiryDate] = useState<DateValue | null>(null)
	const [notes, setNotes] = useState("")
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = (file: File) => {
		setUploadedFile(file)
	}

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

		const data: DocumentData = { type }
		if (expiryDate) {
			data.expiryDate = `${expiryDate.year}-${String(expiryDate.month).padStart(2, "0")}-${String(expiryDate.day).padStart(2, "0")}`
		}
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

	const handleClose = () => {
		onClose()
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
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>{t("addDocumentModal.title")}</Modal.Heading>
					</Modal.Header>
					<Modal.Body>
						{step === 1 ? (
							<div className="flex flex-col gap-4">
								<input className="hidden" onChange={handleFileInputChange} ref={fileInputRef} type="file" />
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
									<div className="flex size-16 items-center justify-center rounded-full bg-default-100">
										<TablerFileText className="size-8 text-primary" />
									</div>
									<div className="flex items-center">
										<span className="text-default-600 text-xs">
											{uploadedFile ? uploadedFile.name : t("addDocumentModal.dragPrompt")}
										</span>
										{!uploadedFile && (
											<span className="font-semibold text-default-600 text-xs">
												{t("addDocumentModal.browseToUpload")}
											</span>
										)}
									</div>
								</button>
								{uploadedFile && (
									<Button
										size="sm"
										variant="outline"
										fullWidth
										onPress={() => {
											setUploadedFile(null)
											if (fileInputRef.current) fileInputRef.current.value = ""
										}}
									>
										{t("addDocumentModal.removeFile")}
									</Button>
								)}
								<Button variant="primary" fullWidth isDisabled={!uploadedFile} onPress={handleNext}>
									{t("common.next")}
								</Button>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-3">
									<Input
										variant="secondary"
										value={uploadedFile?.name ?? ""}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const val = e.target.value
											if (uploadedFile) {
												const renamed = new File([uploadedFile], val, { type: uploadedFile.type })
												setUploadedFile(renamed)
											}
										}}
									/>
									<Select
										variant="secondary"
										selectedKey={type || null}
										onSelectionChange={(key) => {
											if (key) setType(String(key))
										}}
									>
										<Label>{t("addDocumentModal.type")}</Label>
										<Select.Trigger>
											<Select.Value />
											<Select.Indicator />
										</Select.Trigger>
										<Select.Popover>
											<ListBox>
												{documentTypes.map((documentType) => {
													const label = documentType.labelKey ? t(documentType.labelKey) : documentType.label

													return (
														<ListBox.Item id={documentType.key} key={documentType.key} textValue={label}>
															{label}
															<ListBox.ItemIndicator />
														</ListBox.Item>
													)
												})}
											</ListBox>
										</Select.Popover>
									</Select>
									<DatePicker value={expiryDate} onChange={setExpiryDate}>
										<Label>{t("addDocumentModal.expirationDate")}</Label>
										<DateField.Group fullWidth variant="secondary">
											<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
											<DateField.Suffix>
												<DatePicker.Trigger>
													<DatePicker.TriggerIndicator />
												</DatePicker.Trigger>
											</DateField.Suffix>
										</DateField.Group>
										<DatePicker.Popover>
											<Calendar aria-label={t("addDocumentModal.expirationDate")}>
												<Calendar.Header>
													<Calendar.NavButton slot="previous" />
													<Calendar.Heading />
													<Calendar.NavButton slot="next" />
												</Calendar.Header>
												<Calendar.Grid>
													<Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
												</Calendar.Grid>
											</Calendar>
										</DatePicker.Popover>
									</DatePicker>
									<TextField variant="secondary">
										<Label>{t("addDocumentModal.notes")}</Label>

										<Input
											value={notes}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
										/>
									</TextField>
								</div>
								<div className="flex flex-col gap-3">
									<Button variant="primary" fullWidth isDisabled={!type} isPending={isPending} onPress={handleSave}>
										{t("common.save")}
									</Button>
									<Button fullWidth variant="outline" onPress={handleBack}>
										{t("common.back")}
									</Button>
									<Button fullWidth variant="secondary" onPress={handleClose}>
										{t("common.cancel")}
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
