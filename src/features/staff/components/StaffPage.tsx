import { useTranslation } from "react-i18next"

import StaffTable from "./StaffTable"

const StaffPage = () => {
	const { t } = useTranslation()

	return (
		<main className="container mx-auto max-w-4xl">
			<h1 className="mb-8 font-semibold text-4xl">{t("staff.title")}</h1>
			<StaffTable />
		</main>
	)
}

export default StaffPage
