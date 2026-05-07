const columns = [
	{ key: "name", labelKey: "students.detail.documents.columns.name", isRowHeader: true },
	{ key: "status", labelKey: "students.detail.documents.columns.status", align: "center" as const },
	{ key: "expiryDate", labelKey: "students.detail.documents.columns.expiryDate" },
	{ key: "type", labelKey: "students.detail.documents.columns.type" },
	{ key: "uploaded", labelKey: "students.detail.documents.columns.uploaded" },
	{ key: "actions", labelKey: "students.detail.documents.columns.actions", align: "center" as const },
]

export default columns
