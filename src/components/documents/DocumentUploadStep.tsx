import { Button } from "@heroui/react"
import { useTranslation } from "react-i18next"

import TablerFileText from "~icons/tabler/file-text"

interface DocumentUploadStepProps {
	file: File | null
	fileInputRef: React.RefObject<HTMLInputElement | null>
	isDragging: boolean
	onDragLeave: (event: React.DragEvent) => void
	onDragOver: (event: React.DragEvent) => void
	onDrop: (event: React.DragEvent) => void
	onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	onNext: () => void
	onOpenFilePicker: () => void
	onRemoveFile: () => void
}

const DocumentUploadStep = ({
	file,
	fileInputRef,
	isDragging,
	onDragLeave,
	onDragOver,
	onDrop,
	onFileInputChange,
	onNext,
	onOpenFilePicker,
	onRemoveFile,
}: DocumentUploadStepProps) => {
	const { t } = useTranslation()

	return (
		<div className="flex flex-col gap-4">
			<input className="hidden" onChange={onFileInputChange} ref={fileInputRef} type="file" />
			<button
				className={`flex w-full cursor-pointer flex-col items-center gap-4 rounded-lg border border-dashed p-4 transition-colors ${
					isDragging ? "border-primary bg-primary/10" : "border-default-400"
				}`}
				onClick={onOpenFilePicker}
				onDragLeave={onDragLeave}
				onDragOver={onDragOver}
				onDrop={onDrop}
				type="button"
			>
				<div className="flex size-16 items-center justify-center rounded-full bg-default-100">
					<TablerFileText className="size-8 text-primary" />
				</div>
				<div className="flex items-center">
					<span className="text-default-600 text-xs">{file ? file.name : t("addDocumentModal.dragPrompt")}</span>
					{!file && (
						<span className="font-semibold text-default-600 text-xs">{t("addDocumentModal.browseToUpload")}</span>
					)}
				</div>
			</button>
			{file && (
				<Button fullWidth onPress={onRemoveFile} size="sm" variant="outline">
					{t("addDocumentModal.removeFile")}
				</Button>
			)}
			<Button fullWidth isDisabled={!file} onPress={onNext} variant="primary">
				{t("common.next")}
			</Button>
		</div>
	)
}

export default DocumentUploadStep
