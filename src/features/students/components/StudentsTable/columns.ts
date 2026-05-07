const columns: {
	key: string
	labelKey: string
	align?: "center" | "start" | "end"
	isRowHeader?: boolean
}[] = [
	{ key: "name", labelKey: "students.table.columns.name", isRowHeader: true },
	{ key: "parents", labelKey: "students.table.columns.parents", align: "center" },
	{ key: "room", labelKey: "students.table.columns.room" },
	{ key: "tags", labelKey: "students.table.columns.tags" },
	{ key: "actions", labelKey: "students.table.columns.actions", align: "center" },
]

export default columns
