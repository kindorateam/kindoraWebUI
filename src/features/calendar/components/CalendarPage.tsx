import CalendarView from "./CalendarView"
import DeleteEventModal from "./DeleteEventModal"
import EventModal from "./EventModal"

export default function CalendarPage() {
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
