export interface StudentParent {
	id: string
	name: string
	avatar?: string
	email?: string
	phone?: string
	pin?: string
}

export interface Student {
	id: string
	firstName: string
	lastName: string
	avatar?: string
	roomId?: string
	roomName?: string
	roomIcon?: string
	status: StudentStatus
	parents: StudentParent[]
	tags: string[]
}

export type StudentStatus = "active" | "inactive"

export interface GetStudentsResult {
	students: Student[]
	total: number
	limit: number
	offset: number
}
