import { Button, Chip, Dropdown, ListBox } from "@heroui/react"

import TablerDownload from "~icons/tabler/download"
import TablerEye from "~icons/tabler/eye"
import TablerTrash from "~icons/tabler/trash"

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
	active: "min-w-28 justify-center text-white text-xs",
	expiring_soon: "min-w-28 justify-center text-white text-xs",
	expired: "min-w-28 justify-center text-white text-xs",
	uploaded: "min-w-28 justify-center text-black text-xs",
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
					{document.notes && <span className="text-default-400 text-xs">{document.notes}</span>}
				</div>
			)

		case "uploaded":
			return (
				<div className="flex flex-col">
					<span className="text-sm">{formatDate(document.uploadedAt)}</span>
				</div>
			)

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown>
						<Dropdown.Trigger>
							<Button isIconOnly variant="ghost">
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
						</Dropdown.Trigger>
						<Dropdown.Popover className="min-w-0">
							<Dropdown.Menu aria-label="Document actions">
								<Dropdown.Item
									id="view"
									textValue="View"
									className="text-success"
									onAction={() => handleView(document)}
								>
									<ListBox.ItemIndicator />
									<TablerEye aria-hidden className="size-5" />
									<span>View</span>
								</Dropdown.Item>
								<Dropdown.Item
									id="download"
									textValue="Download"
									className="text-warning"
									onAction={() => handleDownload(document)}
								>
									<ListBox.ItemIndicator />
									<TablerDownload aria-hidden className="size-5" />
									<span>Download</span>
								</Dropdown.Item>
								<Dropdown.Item
									id="delete"
									textValue="Delete"
									className="text-danger"
									onAction={() => openDeleteDocumentModal(document.id)}
								>
									<ListBox.ItemIndicator />
									<TablerTrash aria-hidden className="size-5" />
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
