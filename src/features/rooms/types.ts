// Room types
export type RoomType = "turtle" | "rabbit" | "bear" | "butterfly" | "owl" | "fox"

export type RoomStatus = "active" | "inactive" | "deleted"

// API request types
export interface RoomCreatePayload {
	title: string
	capacity: number
	ratio: number
	minAge: number // in months (0-255)
	maxAge: number // in months (0-255)
	color?: string
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
	avatar?: Asset
	checkedIn: boolean
	roomId?: string
	avatarId?: string
	parents?: ApiParent[]
	tags?: string[]
}

export interface ApiStaff {
	id: string
	firstname: string
	lastname: string
	avatar?: Asset
	checkedIn: boolean
	roomId?: string
	avatarId?: string
}

export interface ApiRoom {
	id: string
	companyId: string
	title: string
	capacity: number
	ratio: number
	minAge: number
	maxAge: number
	color?: string
	logo?: Asset
	status: RoomStatus
	students?: ApiStudent[]
	staff?: ApiStaff[]
}

// UI types
export interface Room {
	id: string
	name: string
	icon: RoomType
	capacity: number
	ratio: number
	minAge: number // in months
	maxAge: number // in months
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
