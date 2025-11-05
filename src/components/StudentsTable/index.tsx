import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import DataTable from "@/components/DataTable"
import { getStudents } from "@/services/student.service"

import createStudentsColumns from "./StudentsTableConfig"

const StudentsTable = () => {
	const { data: students = [], isLoading } = useQuery({
		queryKey: ["students"],
		queryFn: getStudents,
	})

	const columns = useMemo(() => createStudentsColumns(), [])

	return (
		<DataTable
			columns={columns}
			data={students}
			emptyMessage="No students found"
			getRowKey={(student) => student.id}
			isLoading={isLoading}
		/>
	)
}

export default StudentsTable
