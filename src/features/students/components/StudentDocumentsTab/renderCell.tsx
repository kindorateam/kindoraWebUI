import { Button, Chip, Dropdown, ListBox } from "@heroui/react"

import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"
import MaterialSymbolsDownload from "~icons/material-symbols/download"
import TablerEdit from "~icons/tabler/edit"
import TablerEye from "~icons/tabler/eye"

import { getStudentDocumentDownloadUrl } from "../../services/student.service"
import { openDeleteDocumentModal } from "../../stores/deleteDocumentModal.store"

import type { StudentDocument, StudentDocumentStatus } from "../../types"

const statusColorMap: Record<StudentDocumentStatus, "success" | "warning" | "danger" | "default"> = {
	active: "success",
	expiring_soon: "warning",
	expired: "danger",
	uploaded: "default",
}

const statusTextClass: Record<StudentDocumentStatus, string> = {
	active: "justify-center text-white text-xs",
	expiring_soon: "justify-center text-white text-xs",
	expired: "justify-center text-white text-xs",
	uploaded: "justify-center text-black text-xs",
}

const statusLabelMap: Record<StudentDocumentStatus, string> = {
	active: "Active",
	expiring_soon: "Expiring Soon",
	expired: "Expired",
	uploaded: "Uploaded",
}

function formatDate(date: string | null): string {
	if (!date) return "No data"
	return new Date(date).toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	})
}

function getDocumentFileName(document: StudentDocument): string {
	if (!document.media?.path) return "Document"
	return document.media.path.split("/").pop() ?? "Document"
}

function handleDownload(document: StudentDocument) {
	const url = getStudentDocumentDownloadUrl(document.studentId, document.id)
	window.open(url, "_blank")
}

function handleView(document: StudentDocument) {
	if (document.media?.path) {
		window.open(document.media.path, "_blank")
	}
}

export function renderCell(document: StudentDocument, columnKey: React.Key) {
	switch (columnKey) {
		case "name":
			return <span className="text-sm">{getDocumentFileName(document)}</span>

		case "status":
			return (
				<div className="flex justify-center">
					<Chip
						className={statusTextClass[document.status]}
						color={statusColorMap[document.status]}
						size="md"
						variant="primary"
					>
						{statusLabelMap[document.status]}
					</Chip>
				</div>
			)

		case "expiryDate":
			return <span className="text-sm">{formatDate(document.expiryDate)}</span>

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
					<span className="text-sm">{formatDate(document.uploadedAt)}</span>
					{document.uploadedBy?.name && <span className="text-xs text-zinc-400">by {document.uploadedBy.name}</span>}
				</div>
			)

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Button isIconOnly variant="ghost" aria-label="Document actions">
							<svg
								aria-hidden="true"
								className="size-5 text-gray-600"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								viewBox="0 0 24 24"
							>
								<circle cx={12} cy={12} r={1} />
								<circle cx={12} cy={5} r={1} />
								<circle cx={12} cy={19} r={1} />
							</svg>
						</Button>
						<Dropdown.Popover className="min-w-0">
							<Dropdown.Menu
								aria-label="Document actions"
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
								<Dropdown.Item id="view" textValue="Preview" className="text-success">
									<ListBox.ItemIndicator />
									<TablerEye aria-hidden className="size-5" />
									<span>Preview</span>
								</Dropdown.Item>
								<Dropdown.Item id="edit" textValue="Edit" className="text-warning">
									<ListBox.ItemIndicator />
									<TablerEdit aria-hidden className="size-5" />
									<span>Edit</span>
								</Dropdown.Item>
								<Dropdown.Item id="download" textValue="Download" className="text-primary">
									<ListBox.ItemIndicator />
									<MaterialSymbolsDownload aria-hidden className="size-5" />
									<span>Download</span>
								</Dropdown.Item>
								<Dropdown.Item id="delete" textValue="Delete" className="text-danger">
									<ListBox.ItemIndicator />
									<MaterialSymbolsDeleteOutline aria-hidden className="size-5" />
									<span>Delete</span>
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
