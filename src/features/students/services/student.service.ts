import type { GetStudentsResult, Student } from "../types"

export interface GetStudentsParams {
	status?: string
	limit?: number
	offset?: number
}

const FIRST_NAMES = ["James", "Emma", "Liam", "Olivia", "Noah"] as const
const LAST_NAMES = ["Whitaker", "Johnson", "Williams", "Brown", "Davis"] as const
const ROOM_NAMES = ["Baby turtles", "Little stars", "Sunshine"] as const
const ALL_TAGS = ["Allergy", "Special needs", "Bus rider", "After care", "Lunch", "Nap", "Early pickup", "Medication"]

const MOCK_STUDENTS: Student[] = Array.from({ length: 25 }, (_, i) => ({
	id: `student-${i + 1}`,
	// biome-ignore lint/style/noNonNullAssertion: modulo index is always in bounds
	firstName: FIRST_NAMES[i % FIRST_NAMES.length]!,
	// biome-ignore lint/style/noNonNullAssertion: modulo index is always in bounds
	lastName: LAST_NAMES[i % LAST_NAMES.length]!,
	avatar: undefined,
	roomId: `room-${(i % 3) + 1}`,
	// biome-ignore lint/style/noNonNullAssertion: modulo index is always in bounds
	roomName: ROOM_NAMES[i % ROOM_NAMES.length]!,
	roomIcon: "🐢",
	status: "active" as const,
	parents: [
		{
			id: `parent-${i}-1`,
			name: "Sarah Whitaker",
			avatar: undefined,
			email: "sarah.whitaker@email.com",
			phone: "+1 (555) 123-4567",
			pin: "1234",
		},
		{
			id: `parent-${i}-2`,
			name: "John Whitaker",
			avatar: undefined,
			email: "john.whitaker@email.com",
			phone: "+1 (555) 987-6543",
			pin: "5678",
		},
	],
	tags: ALL_TAGS.slice(0, (i % 5) + 2),
}))

export async function getStudents(params: GetStudentsParams = {}): Promise<GetStudentsResult> {
	const { limit = 10, offset = 0 } = params

	// TODO: Replace with real API call
	// return apiClient.get<GetStudentsResult>("/students", { params: { status, limit, offset } })

	await new Promise((resolve) => setTimeout(resolve, 500))

	const paged = MOCK_STUDENTS.slice(offset, offset + limit)
	return {
		students: paged,
		total: MOCK_STUDENTS.length,
		limit,
		offset,
	}
}
