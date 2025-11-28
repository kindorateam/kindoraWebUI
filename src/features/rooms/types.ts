// Room types
export type RoomType = "turtle" | "rabbit" | "bear" | "butterfly" | "owl" | "fox"

// API response types
export interface Asset {
	id: string
	path: string
}

export interface ApiStudent {
	id: string
	first_name: string
	last_name: string
	avatar?: Asset
	checked_in: boolean
}

export interface ApiStaff {
	id: string
	first_name: string
	last_name: string
	avatar?: Asset
	checked_in: boolean
}

export interface ApiRoom {
	id: string
	company_id: string
	title: string
	capacity: number
	logo_id: string
	logo: Asset
	status: string
	checked_in_students: number
	checked_in_employees: number
	students: ApiStudent[]
	staff: ApiStaff[]
}

// UI types
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
	checkedIn: boolean
}

export interface StaffMember {
	id: string
	name: string
	avatar: string
	checkedIn: boolean
}

// Add Room form types - defined in schemas/addRoom.schema.ts
export type { AddRoomFormData } from "./schemas/addRoom.schema"
