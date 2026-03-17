import StaffTable from "./StaffTable"

export default function StaffPage() {
	return (
		<main className="container mx-auto max-w-4xl px-4">
			<h1 className="mb-8 font-semibold text-4xl">Staff</h1>
			<StaffTable />
		</main>
	)
}
