import type { GetStudentsResult, Student, StudentDocument } from "../types"

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

const MOCK_STUDENT_DOCUMENTS: Record<string, StudentDocument[]> = Object.fromEntries(
	MOCK_STUDENTS.map((student, index) => [
		student.id,
		[
			{
				id: index * 10 + 1,
				studentId: student.id,
				media: {
					id: `doc-${student.id}-1`,
					path: `/mock/student-documents/${student.id}/medical-form.pdf`,
				},
				status: "active",
				expiryDate: "2026-12-31",
				type: "Medical Form",
				notes: "Signed by pediatrician",
				uploadedAt: "2026-01-15T10:00:00.000Z",
				uploadedBy: { id: "admin-1" },
			},
			{
				id: index * 10 + 2,
				studentId: student.id,
				media: {
					id: `doc-${student.id}-2`,
					path: `/mock/student-documents/${student.id}/immunization-record.pdf`,
				},
				status: index % 3 === 0 ? "expiring_soon" : "uploaded",
				expiryDate: index % 3 === 0 ? "2026-04-15" : null,
				type: "Immunization Record",
				notes: null,
				uploadedAt: "2026-02-01T12:00:00.000Z",
				uploadedBy: { id: "admin-1" },
			},
		],
	]),
)

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

export async function getStudentDocuments(studentId: string): Promise<StudentDocument[]> {
	await new Promise((resolve) => setTimeout(resolve, 300))
	return [...(MOCK_STUDENT_DOCUMENTS[studentId] ?? [])]
}

export async function uploadStudentDocument(
	studentId: string,
	file: File,
	data: { type: string; expiryDate?: string; notes?: string },
): Promise<StudentDocument> {
	await new Promise((resolve) => setTimeout(resolve, 300))

	const uploadedDocument: StudentDocument = {
		id: Date.now(),
		studentId,
		media: {
			id: crypto.randomUUID(),
			path: URL.createObjectURL(file),
		},
		status: "uploaded",
		expiryDate: data.expiryDate ?? null,
		type: data.type,
		notes: data.notes ?? null,
		uploadedAt: new Date().toISOString(),
		uploadedBy: { id: "admin-1" },
	}

	MOCK_STUDENT_DOCUMENTS[studentId] = [uploadedDocument, ...(MOCK_STUDENT_DOCUMENTS[studentId] ?? [])]

	return uploadedDocument
}

export async function deleteStudentDocument(studentId: string, documentId: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 300))

	const existingDocuments = MOCK_STUDENT_DOCUMENTS[studentId] ?? []
	MOCK_STUDENT_DOCUMENTS[studentId] = existingDocuments.filter((document) => document.id !== documentId)
}

export function getStudentDocumentDownloadUrl(studentId: string, documentId: number): string {
	const document = (MOCK_STUDENT_DOCUMENTS[studentId] ?? []).find((item) => item.id === documentId)
	return document?.media.path ?? ""
}
