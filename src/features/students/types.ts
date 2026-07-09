export interface ShortMedia {
	id: string
	path: string
	name?: string
}

export interface StudentParent {
	id: string
	firstName: string
	lastName: string
	avatar?: ShortMedia
	email?: string | null
	phone?: string | null
	pin?: string | null
	relationshipToStudent?: string | null
}

export interface StudentSibling {
	id: string
	firstName: string
	lastName: string
	avatar?: ShortMedia
	relationshipToStudent?: string | null
	dateOfBirth?: string | null
	assignedRoomTitle?: string | null
}

export interface StudentGuardian {
	id: string
	firstName: string
	lastName: string
	avatar?: ShortMedia
	phone?: string | null
	pin?: string | null
	relationshipToStudent?: string | null
}

export interface StudentMedicalInfo {
	allergies?: string[]
	medications?: string | null
	doctor?: string | null
	doctorPhone?: string | null
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

export type StudentDocumentStatus = SharedDocumentStatus

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
	birthday?: string | null
	dietRestriction?: string | null
	state?: string | null
	city?: string | null
	streetAddress?: string | null
	zipCode?: string | null
	enrollDate?: string | null
	siblings?: StudentSibling[]
	guardians?: StudentGuardian[]
	medicalInfo?: StudentMedicalInfo
}

export type StudentDocumentMedia = DocumentMedia

export interface StudentDocument extends DocumentRecord {
	studentId: string
}

export interface GetStudentsResult {
	items: Student[]
	total: number
	limit: number
	offset: number
}

import type {
	DocumentMedia,
	DocumentRecord,
	DocumentStatus as SharedDocumentStatus,
} from "@/components/documents/types"
