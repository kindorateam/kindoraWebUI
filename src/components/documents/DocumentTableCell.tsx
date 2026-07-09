import { Button, Chip, Dropdown, ListBox } from "@heroui/react"
import { useTranslation } from "react-i18next"

import { formatShortDate } from "@/utils/date"
import { getMediaUrl } from "@/utils/media"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"
import MaterialSymbolsDownload from "~icons/material-symbols/download"
import TablerDotsVertical from "~icons/tabler/dots-vertical"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"

import type { DocumentRecord, DocumentStatus } from "./types"

export type DocumentTranslationScope = "staff.documents" | "students.detail.documents"

interface DocumentTableCellProps {
	columnKey: React.Key
	document: DocumentRecord
	locale: string
	onDelete: (documentId: number) => void
	translationScope: DocumentTranslationScope
}

const statusColorMap: Record<DocumentStatus, "success" | "warning" | "danger" | "default"> = {
	active: "success",
	expiring_soon: "warning",
	expired: "danger",
	uploaded: "default",
}

const getDocumentFileName = (document: DocumentRecord, fallback: string): string => {
	if (document.media.name) return document.media.name
	if (!document.media.path) return fallback
	return document.media.path.split("/").pop() ?? fallback
}

const openDocument = (document: DocumentRecord) => {
	if (!document.media.path) return
	window.open(getMediaUrl(document.media.path), "_blank", "noopener,noreferrer")
}

const DocumentTableCell = ({ columnKey, document, locale, onDelete, translationScope }: DocumentTableCellProps) => {
	const { t } = useTranslation()
	const actionKey = (action: "ariaLabel" | "preview" | "edit" | "download" | "delete") =>
		`${translationScope}.actions.${action}` as const

	switch (columnKey) {
		case "name":
			return <span className="text-sm">{getDocumentFileName(document, t("common.document"))}</span>

		case "status":
			return (
				<div className="flex justify-center">
					<Chip
						className={`justify-center text-xs capitalize ${document.status === "uploaded" ? "text-black" : "text-white"}`}
						color={statusColorMap[document.status]}
						size="md"
						variant="primary"
					>
						{document.status.replace("_", " ")}
					</Chip>
				</div>
			)

		case "expiryDate":
			return <span className="text-sm">{formatShortDate(document.expiryDate, locale, t("common.noData"))}</span>

		case "type":
			return (
				<div className="flex flex-col">
					<span className="text-sm">{document.type}</span>
					{document.notes && <span className="text-xs text-zinc-400">{document.notes}</span>}
				</div>
			)

		case "uploaded":
			return (
				<div className="flex flex-col">
					<span className="text-sm">{formatShortDate(document.uploadedAt, locale, t("common.noData"))}</span>
					{document.uploadedBy?.name && (
						<span className="text-xs text-zinc-400">{t("common.by", { name: document.uploadedBy.name })}</span>
					)}
				</div>
			)

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Button aria-label={t(actionKey("ariaLabel"))} isIconOnly variant="ghost">
							<TablerDotsVertical aria-hidden className="size-5 text-gray-600" />
						</Button>
						<Dropdown.Popover className="min-w-0">
							<Dropdown.Menu
								aria-label={t(actionKey("ariaLabel"))}
								onAction={(key) => {
									if (key === "view" || key === "download") openDocument(document)
									if (key === "delete") onDelete(document.id)
								}}
							>
								<Dropdown.Item className="text-success" id="view" textValue={t(actionKey("preview"))}>
									<ListBox.ItemIndicator />
									<TablerEye aria-hidden className="size-5" />
									<span>{t(actionKey("preview"))}</span>
								</Dropdown.Item>
								<Dropdown.Item className="text-warning" id="edit" textValue={t(actionKey("edit"))}>
									<ListBox.ItemIndicator />
									<TablerEdit aria-hidden className="size-5" />
									<span>{t(actionKey("edit"))}</span>
								</Dropdown.Item>
								<Dropdown.Item className="text-primary" id="download" textValue={t(actionKey("download"))}>
									<ListBox.ItemIndicator />
									<MaterialSymbolsDownload aria-hidden className="size-5" />
									<span>{t(actionKey("download"))}</span>
								</Dropdown.Item>
								<Dropdown.Item className="text-danger" id="delete" textValue={t(actionKey("delete"))}>
									<ListBox.ItemIndicator />
									<MaterialSymbolsDeleteOutline aria-hidden className="size-5" />
									<span>{t(actionKey("delete"))}</span>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown.Popover>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}

export default DocumentTableCell
