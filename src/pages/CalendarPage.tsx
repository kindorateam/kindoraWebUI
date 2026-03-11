import CalendarView from "@/features/calendar/components/CalendarView"
import DeleteEventModal from "@/features/calendar/components/DeleteEventModal"
import EventModal from "@/features/calendar/components/EventModal"

const CalendarPage = () => {
	return (
		<>
			<main className="container mx-auto max-w-6xl px-4">
				<h1 className="mb-8 font-semibold text-4xl">Calendar</h1>
				<CalendarView />
			</main>
			<EventModal />
			<DeleteEventModal />
		</>
	)
}

export default CalendarPage
