import { createFileRoute } from "@tanstack/react-router"

import CalendarPage from "@/features/calendar/components/CalendarPage"

export const Route = createFileRoute("/_authenticated/calendar")({
	component: CalendarPage,
	beforeLoad: () => {
		return {
			breadcrumbKey: "calendar.title",
		}
	},
})
