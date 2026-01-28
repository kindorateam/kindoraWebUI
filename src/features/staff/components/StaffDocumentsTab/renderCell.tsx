import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"

import TablerDownload from "~icons/tabler/download"
import TablerEye from "~icons/tabler/eye"
import TablerTrash from "~icons/tabler/trash"

import { openDeleteDocumentModal } from "../../stores/deleteDocumentModal.store"

import type { DocumentStatus, EmployeeDocument } from "../../types"

const statusColorMap: Record<DocumentStatus, "success" | "warning" | "danger" | "default"> = {
	active: "success",
	expiring_soon: "warning",
	expired: "danger",
	uploaded: "default",
}

const statusTextClass: Record<DocumentStatus, string> = {
	active: "text-white text-xs",
	expiring_soon: "text-white text-xs",
	expired: "text-white text-xs",
	uploaded: "text-black text-xs",
}

const statusLabelMap: Record<DocumentStatus, string> = {
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

export function renderCell(document: EmployeeDocument, columnKey: React.Key) {
	switch (columnKey) {
		case "name":
			return <span className="text-sm">{document.name}</span>

		case "status":
			return (
				<div className="flex justify-center">
					<Chip
						className={statusTextClass[document.status]}
						color={statusColorMap[document.status]}
						size="md"
						variant="solid"
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
					{document.note && <span className="text-default-400 text-xs">{document.note}</span>}
				</div>
			)

		case "uploaded":
			return (
				<div className="flex flex-col">
					<span className="text-sm">{formatDate(document.uploadedAt)}</span>
					{document.uploadedBy && <span className="text-default-400 text-xs">by {document.uploadedBy}</span>}
				</div>
			)

		case "actions":
			return (
				<div className="flex justify-center">
					<Dropdown classNames={{ content: "min-w-0" }}>
						<DropdownTrigger>
							<Button isIconOnly radius="md" variant="light">
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
						</DropdownTrigger>
						<DropdownMenu aria-label="Document actions">
							<DropdownItem
								key="view"
								className="text-success"
								startContent={<TablerEye aria-hidden className="size-5" />}
							>
								View
							</DropdownItem>
							<DropdownItem
								key="download"
								className="text-warning"
								startContent={<TablerDownload aria-hidden className="size-5" />}
							>
								Download
							</DropdownItem>
							<DropdownItem
								key="delete"
								className="text-danger"
								startContent={<TablerTrash aria-hidden className="size-5" />}
								onPress={() => openDeleteDocumentModal(document.id)}
							>
								Delete
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			)

		default:
			return null
	}
}
