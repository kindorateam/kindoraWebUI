import type { MessageParticipant, MessageRecord, MessagesSelectOption } from "./types"

interface StudentSeed {
	studentId: string
	studentName: string
	roomId: string
	roomLabel: string
	parents: string[]
}

const studentSeeds = [
	{
		studentId: "student-1",
		studentName: "James Whitaker",
		roomId: "room-baby-turtle",
		roomLabel: "Baby Turtle",
		parents: ["Monica Whitaker", "Aaron Whitaker"],
	},
	{
		studentId: "student-2",
		studentName: "Kate Robinson",
		roomId: "room-baby-turtle",
		roomLabel: "Baby Turtle",
		parents: ["Noah Robinson", "Ava Robinson"],
	},
	{
		studentId: "student-3",
		studentName: "Emily Carter",
		roomId: "room-rainbow-fish",
		roomLabel: "Rainbow Fish",
		parents: ["Daniel Carter", "Olivia Carter"],
	},
	{
		studentId: "student-4",
		studentName: "Mia Caldwell",
		roomId: "room-rainbow-fish",
		roomLabel: "Rainbow Fish",
		parents: ["Isla Caldwell", "Henry Caldwell"],
	},
	{
		studentId: "student-5",
		studentName: "Olivia Hayes",
		roomId: "room-sunshine",
		roomLabel: "Sunshine",
		parents: ["Grace Hayes", "Lucas Hayes"],
	},
	{
		studentId: "student-6",
		studentName: "Sophie Bennett",
		roomId: "room-sunshine",
		roomLabel: "Sunshine",
		parents: ["Chloe Bennett", "Jack Bennett"],
	},
] satisfies [StudentSeed, ...StudentSeed[]]

const messagePreviews = [
	"Dear Jin, Just a quick reminder to please pack a hat and sunscreen for your child today, we're planning to spend some time outside.",
	"Kate had a great morning circle today and joined every song. She was especially excited about our story time.",
	"We noticed an extra sweater would be helpful this week because the classroom runs cool in the afternoon.",
	"Friendly reminder that tomorrow is picture day, so feel free to send your child in their favorite outfit.",
] as const satisfies readonly [string, ...string[]]

const messageTimes = ["10:36 AM", "10:12 AM", "9:48 AM", "9:05 AM", "8:42 AM"] as const satisfies readonly [
	string,
	...string[],
]

function getCyclicItem<T>(items: readonly [T, ...T[]], index: number): T {
	const item = items[index % items.length]

	if (item === undefined) {
		throw new Error("Expected non-empty collection")
	}

	return item
}

const createParents = (studentId: string, parentNames: string[]): MessageParticipant[] => {
	return parentNames.map((name, index) => ({
		id: `${studentId}-parent-${index + 1}`,
		name,
	}))
}

export const MESSAGE_PAGE_SIZE = 10

export const ROOM_OPTIONS: MessagesSelectOption[] = [
	{ key: "all", label: "All Rooms" },
	...studentSeeds
		.map((student) => ({ key: student.roomId, label: student.roomLabel }))
		.filter((option, index, options) => options.findIndex((item) => item.key === option.key) === index),
]

export const STUDENT_OPTIONS: MessagesSelectOption[] = [
	{ key: "all", label: "All Students" },
	...studentSeeds.map((student) => ({
		key: student.studentId,
		label: student.studentName,
	})),
]

export const MESSAGES: MessageRecord[] = Array.from({ length: 42 }, (_, index) => {
	const student = getCyclicItem(studentSeeds, index)

	return {
		id: `message-${index + 1}`,
		roomId: student.roomId,
		roomLabel: student.roomLabel,
		studentId: student.studentId,
		studentName: student.studentName,
		parents: createParents(student.studentId, student.parents),
		preview: getCyclicItem(messagePreviews, index),
		time: getCyclicItem(messageTimes, index),
	}
})
