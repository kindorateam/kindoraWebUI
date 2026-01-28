import StudentsTable from "@/features/students/components/StudentsTable"

const StudentsPage = () => {
	return (
		<main className="container mx-auto max-w-4xl px-4">
			<h1 className="mb-8 font-semibold text-4xl">Students</h1>
			<StudentsTable />
		</main>
	)
}

export default StudentsPage
