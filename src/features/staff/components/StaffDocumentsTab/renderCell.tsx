import { Button, Chip, Dropdown, ListBox } from "@heroui/react"

import { getMediaUrl } from "@/utils/media"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"
import MaterialSymbolsDownload from "~icons/material-symbols/download"
import TablerDotsVertical from "~icons/tabler/dots-vertical"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"

import { openDeleteDocumentModal } from "../../stores/deleteDocumentModal.store"

import type { TFunction } from "i18next"
import type { DocumentStatus, EmployeeDocument } from "../../types"

const statusColorMap: Record<DocumentStatus, "success" | "warning" | "danger" | "default"> = {
	active: "success",
	expiring_soon: "warning",
	expired: "danger",
	uploaded: "default",
}

const statusTextClass: Record<DocumentStatus, string> = {
	active: "justify-center text-white text-xs",
	expiring_soon: "justify-center text-white text-xs",
	expired: "justify-center text-white text-xs",
	uploaded: "justify-center text-black text-xs",
}

function formatDate(date: string | null, locale: string, t: TFunction): string {
	if (!date) return t("common.noData")
	return new Date(date).toLocaleDateString(locale, {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	})
}

function getDocumentFileName(doc: EmployeeDocument, t: TFunction): string {
	if (doc.media?.name) return doc.media.name
	if (!doc.media?.path) return t("common.document")
	return doc.media.path.split("/").pop() ?? t("common.document")
}

function handleDownload(doc: EmployeeDocument) {
	if (!doc.media?.path) return
	window.open(getMediaUrl(doc.media.path), "_blank", "noopener,noreferrer")
}

function handleView(doc: EmployeeDocument) {
	if (doc.media?.path) {
		window.open(getMediaUrl(doc.media.path), "_blank", "noopener,noreferrer")
	}
}

export function renderCell(document: EmployeeDocument, columnKey: React.Key, t: TFunction, locale: string) {
	switch (columnKey) {
		case "name":
			return <span className="text-sm">{getDocumentFileName(document, t)}</span>

		case "status":
			return (
				<div className="flex justify-center">
					<Chip
						className={`capitalize ${statusTextClass[document.status]}`}
						color={statusColorMap[document.status]}
						size="md"
						variant="primary"
					>
						{document.status.replace("_", " ")}
					</Chip>
				</div>
			)

		case "expiryDate":
			return <span className="text-sm">{formatDate(document.expiryDate, locale, t)}</span>

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
					<span className="text-sm">{formatDate(document.uploadedAt, locale, t)}</span>
					{document.uploadedBy?.name && (
						<span className="text-xs text-zinc-400">{t("common.by", { name: document.uploadedBy.name })}</span>
					)}
				</div>
			)

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Button isIconOnly variant="ghost" aria-label={t("staff.documents.actions.ariaLabel")}>
							<TablerDotsVertical aria-hidden className="size-5 text-gray-600" />
						</Button>
						<Dropdown.Popover className="min-w-0">
							<Dropdown.Menu
								aria-label={t("staff.documents.actions.ariaLabel")}
								onAction={(key) => {
									switch (key) {
										case "view":
											return handleView(document)
										case "download":
											return handleDownload(document)
										case "delete":
											return openDeleteDocumentModal(document.id)
									}
								}}
							>
								<Dropdown.Item id="view" textValue={t("staff.documents.actions.preview")} className="text-success">
									<ListBox.ItemIndicator />
									<TablerEye aria-hidden className="size-5" />
									<span>{t("staff.documents.actions.preview")}</span>
								</Dropdown.Item>
								<Dropdown.Item id="edit" textValue={t("staff.documents.actions.edit")} className="text-warning">
									<ListBox.ItemIndicator />
									<TablerEdit aria-hidden className="size-5" />
									<span>{t("staff.documents.actions.edit")}</span>
								</Dropdown.Item>
								<Dropdown.Item id="download" textValue={t("staff.documents.actions.download")} className="text-primary">
									<ListBox.ItemIndicator />
									<MaterialSymbolsDownload aria-hidden className="size-5" />
									<span>{t("staff.documents.actions.download")}</span>
								</Dropdown.Item>
								<Dropdown.Item id="delete" textValue={t("staff.documents.actions.delete")} className="text-danger">
									<ListBox.ItemIndicator />
									<MaterialSymbolsDeleteOutline aria-hidden className="size-5" />
									<span>{t("staff.documents.actions.delete")}</span>
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
