import type { RoomType } from "./RoomNames"

export interface Room {
	id: string
	name: string
	icon: RoomType
	capacity: number
	studentsCount: number
	staffCount: number
	signedInStudents: Student[]
	signedInStaff: StaffMember[]
}

export interface Student {
	id: string
	name: string
	avatar: string
}

export interface StaffMember {
	id: string
	name: string
	avatar: string
}
