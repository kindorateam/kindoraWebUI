import type { GetStudentsResult, Student } from "../types"

export interface GetStudentsParams {
	status?: string
	limit?: number
	offset?: number
}

const FIRST_NAMES = ["James", "Emma", "Liam", "Olivia", "Noah"] as const
const LAST_NAMES = ["Whitaker", "Johnson", "Williams", "Brown", "Davis"] as const
const ROOMS = [
	{ id: "room-1", title: "Baby turtles" },
	{ id: "room-2", title: "Little stars" },
	{ id: "room-3", title: "Sunshine" },
] as const
const ALL_TAGS = ["Allergy", "Special needs", "Bus rider", "After care", "Lunch", "Nap", "Early pickup", "Medication"]

const MOCK_STUDENTS: Student[] = Array.from({ length: 25 }, (_, i) => {
	// biome-ignore lint/style/noNonNullAssertion: modulo index is always in bounds
	const room = ROOMS[i % ROOMS.length]!
	return {
		id: `student-${i + 1}`,
		// biome-ignore lint/style/noNonNullAssertion: modulo index is always in bounds
		firstName: FIRST_NAMES[i % FIRST_NAMES.length]!,
		// biome-ignore lint/style/noNonNullAssertion: modulo index is always in bounds
		lastName: LAST_NAMES[i % LAST_NAMES.length]!,
		avatar: undefined,
		roomId: room.id,
		room: { id: room.id, title: room.title },
		checkedIn: i % 3 !== 0,
		parents: [
			{
				id: `parent-${i}-1`,
				firstName: "Sarah",
				lastName: "Whitaker",
				avatar: undefined,
			},
			{
				id: `parent-${i}-2`,
				firstName: "John",
				lastName: "Whitaker",
				avatar: undefined,
			},
		],
		tags: ALL_TAGS.slice(0, (i % 5) + 2),
	}
})

export async function getStudents(params: GetStudentsParams = {}): Promise<GetStudentsResult> {
	const { limit = 10, offset = 0 } = params

	// TODO: Replace with real API call
	// return apiClient.get<GetStudentsResult>("/rooms/all-students-list", { params: { limit, offset } })

	await new Promise((resolve) => setTimeout(resolve, 500))

	const paged = MOCK_STUDENTS.slice(offset, offset + limit)
	return {
		items: paged,
		total: MOCK_STUDENTS.length,
		limit,
		offset,
	}
}

export async function getStudentById(studentId: string): Promise<Student> {
	// TODO: Replace with real API call
	// return apiClient.get<Student>(`/students/${studentId}`)

	await new Promise((resolve) => setTimeout(resolve, 300))

	const student = MOCK_STUDENTS.find((item) => item.id === studentId)
	if (!student) {
		throw new Error(`Student with id ${studentId} not found`)
	}

	return student
}
