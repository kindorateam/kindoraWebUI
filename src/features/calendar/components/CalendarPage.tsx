import CalendarView from "./CalendarView"
import DeleteEventModal from "./DeleteEventModal"
import EventModal from "./EventModal"

export default function CalendarPage() {
	return (
		<>
			<main className="container mx-auto max-w-7xl px-6 py-5">
				<div className="mb-6 flex flex-col gap-1">
					<h1 className="font-semibold text-3xl text-foreground">Calendar</h1>
					<p className="text-default-500 text-sm">Plan classroom events, staff blocks, and center-wide closures.</p>
				</div>
				<CalendarView />
			</main>
			<EventModal />
			<DeleteEventModal />
		</>
	)
}
