const columns = [
	{ key: "room", labelKey: "rooms.table.columns.room", isRowHeader: true },
	{ key: "capacity", labelKey: "rooms.table.columns.capacity", align: "center" as const },
	{ key: "students", labelKey: "rooms.table.columns.students", align: "center" as const },
	{ key: "staff", labelKey: "rooms.table.columns.staff", align: "center" as const },
	{ key: "signInStudents", labelKey: "rooms.table.columns.signInStudents", align: "center" as const },
	{ key: "signInStaff", labelKey: "rooms.table.columns.signInStaff", align: "center" as const },
	{ key: "ratio", labelKey: "rooms.table.columns.ratio", align: "center" as const },
	{ key: "actions", labelKey: "rooms.table.columns.actions", align: "center" as const },
]

export default columns
