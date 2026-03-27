const columns: { key: string; label: string; align?: "center" | "start" | "end"; isRowHeader?: boolean }[] = [
	{ key: "name", label: "Student's Name", isRowHeader: true },
	{ key: "parents", label: "Parents", align: "center" },
	{ key: "room", label: "Room" },
	{ key: "tags", label: "Tags" },
	{ key: "actions", label: "Actions", align: "center" },
]

export default columns
