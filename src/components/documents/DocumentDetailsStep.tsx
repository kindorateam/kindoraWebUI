import { Button, Input, Label, ListBox, Select, TextField } from "@heroui/react"
import { useTranslation } from "react-i18next"

import DatePickerField from "@/components/ui/DatePickerField"

import type { DateValue } from "@internationalized/date"
import type { DocumentTypeOption } from "./types"

interface DocumentDetailsStepProps {
	documentTypes: DocumentTypeOption[]
	expiryDate: DateValue | null
	file: File
	isPending: boolean
	notes: string
	onBack: () => void
	onCancel: () => void
	onExpiryDateChange: (value: DateValue | null) => void
	onFileChange: (file: File) => void
	onNotesChange: (notes: string) => void
	onSave: () => void
	onTypeChange: (type: string) => void
	type: string
}

const DocumentDetailsStep = ({
	documentTypes,
	expiryDate,
	file,
	isPending,
	notes,
	onBack,
	onCancel,
	onExpiryDateChange,
	onFileChange,
	onNotesChange,
	onSave,
	onTypeChange,
	type,
}: DocumentDetailsStepProps) => {
	const { t } = useTranslation()

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3">
				<Input
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						onFileChange(new File([file], event.target.value, { type: file.type }))
					}
					value={file.name}
					variant="secondary"
				/>
				<Select
					onSelectionChange={(key) => {
						if (key) onTypeChange(String(key))
					}}
					selectedKey={type || null}
					variant="secondary"
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
				<DatePickerField
					label={t("addDocumentModal.expirationDate")}
					onChange={onExpiryDateChange}
					value={expiryDate}
				/>
				<TextField variant="secondary">
					<Label>{t("addDocumentModal.notes")}</Label>
					<Input
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => onNotesChange(event.target.value)}
						value={notes}
					/>
				</TextField>
			</div>
			<div className="flex flex-col gap-3">
				<Button fullWidth isDisabled={!type} isPending={isPending} onPress={onSave} variant="primary">
					{t("common.save")}
				</Button>
				<Button fullWidth onPress={onBack} variant="outline">
					{t("common.back")}
				</Button>
				<Button fullWidth onPress={onCancel} variant="secondary">
					{t("common.cancel")}
				</Button>
			</div>
		</div>
	)
}

export default DocumentDetailsStep
