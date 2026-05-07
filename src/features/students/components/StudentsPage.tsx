import { useTranslation } from "react-i18next"

import StudentsTable from "./StudentsTable"

export default function StudentsPage() {
	const { t } = useTranslation()

	return (
		<main className="container mx-auto max-w-4xl">
			<h1 className="mb-8 font-semibold text-4xl">{t("students.title")}</h1>
			<StudentsTable />
		</main>
	)
}
