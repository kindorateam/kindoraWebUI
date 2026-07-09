import { useTranslation } from "react-i18next"

import MealDetailsModal from "@/features/meals/components/MealDetailsModal"

import CalendarView from "./CalendarView"
import DeleteEventModal from "./DeleteEventModal"
import EventModal from "./EventModal"

const CalendarPage = () => {
	const { t } = useTranslation()

	return (
		<>
			<main className="container mx-auto max-w-7xl px-6 py-5">
				<div className="mb-6 flex flex-col gap-1">
					<h1 className="font-semibold text-3xl text-foreground">{t("calendar.title")}</h1>
					<p className="text-default-500 text-sm">{t("calendar.description")}</p>
				</div>
				<CalendarView />
			</main>
			<EventModal />
			<MealDetailsModal />
			<DeleteEventModal />
		</>
	)
}

export default CalendarPage
