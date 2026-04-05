import StudentsTable from "./StudentsTable"

export default function StudentsPage() {
	return (
		<main className="container mx-auto max-w-4xl">
			<h1 className="mb-8 font-semibold text-4xl">Students</h1>
			<StudentsTable />
		</main>
	)
}
