const columns = [
	{ key: "name", labelKey: "staff.documents.columns.name", isRowHeader: true },
	{ key: "status", labelKey: "staff.documents.columns.status", align: "center" as const },
	{ key: "expiryDate", labelKey: "staff.documents.columns.expiryDate" },
	{ key: "type", labelKey: "staff.documents.columns.type" },
	{ key: "uploaded", labelKey: "staff.documents.columns.uploaded" },
	{ key: "actions", labelKey: "staff.documents.columns.actions", align: "center" as const },
]

export default columns
