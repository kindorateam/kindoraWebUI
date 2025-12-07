// Room types
export type RoomType = "turtle" | "rabbit" | "bear" | "butterfly" | "owl" | "fox"

export type RoomStatus = "active" | "inactive" | "archived"

// API request types
export interface RoomCreatePayload {
	companyId: string
	title: string
	capacity: number
	color?: string
	logoId?: string | null
	status?: RoomStatus
	studentIds?: string[]
	employeeIds?: string[]
}

// API response types
export interface Asset {
	id: string
	path: string
}

export interface ApiParent {
	id: string
	firstname: string
	lastname: string
}

export interface ApiStudent {
	id: string
	firstname: string
	lastname: string
	avatar?: Asset | null
	checkedIn: boolean
	parents?: ApiParent[] | null
	tags?: string[] | null
}

export interface ApiStaff {
	id: string
	firstname: string
	lastname: string
	avatar?: Asset | null
	checkedIn: boolean
}

export interface ApiRoom {
	id: string
	title: string
	capacity: number
	ratio: number
	logo?: Asset | null
	status: string
	students?: ApiStudent[] | null
	staff?: ApiStaff[] | null
}

// UI types
export interface Room {
	id: string
	name: string
	icon: RoomType
	capacity: number
	ratio: number
	studentsCount: number
	staffCount: number
	signedInStudents: Student[]
	signedInStaff: StaffMember[]
}

export interface Parent {
	id: string
	name: string
}

export interface Student {
	id: string
	name: string
	avatar: string
	checkedIn: boolean
	parents: Parent[]
	tags: string[]
}

export interface StaffMember {
	id: string
	name: string
	avatar: string
	checkedIn: boolean
}

// Add Room form types - defined in schemas/addRoom.schema.ts
export type { AddRoomFormData } from "./schemas/addRoom.schema"
