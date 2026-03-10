export interface ShortMedia {
	id: string
	path: string
}

export interface StudentParent {
	id: string
	firstName: string
	lastName: string
	avatar?: ShortMedia
}

export interface StudentAbsence {
	id: number
	dateFrom: string
	dateTo: string
	reason: string
}

export interface StudentRoom {
	id: string
	title: string
}

export type StudentDocumentStatus = "active" | "expiring_soon" | "expired" | "uploaded"

export interface Student {
	id: string
	firstName: string
	lastName: string
	avatar?: ShortMedia
	roomId: string
	room?: StudentRoom
	checkedIn: boolean
	parents?: StudentParent[]
	tags?: string[]
	absence?: StudentAbsence
}

export interface StudentDocumentMedia {
	id: string
	path: string
}

export interface StudentDocument {
	id: number
	studentId: string
	media: StudentDocumentMedia
	status: StudentDocumentStatus
	expiryDate: string | null
	type: string
	notes: string | null
	uploadedAt: string
	uploadedBy: { id: string } | null
}

export interface GetStudentsResult {
	items: Student[]
	total: number
	limit: number
	offset: number
}
