// Room types
export type RoomType = "turtle" | "rabbit" | "bear" | "butterfly" | "owl" | "fox"

export type RoomStatus = "active" | "inactive" | "deleted"

// API request types (matching swagger dto.CreateRoomDTO)
export interface RoomCreatePayload {
	title: string
	capacity: number
	ratio: number
	minAge: number // in months (0-255)
	maxAge: number // in months (0-255)
	color?: string
	logoId?: string
	studentIds?: string[]
	employeeIds?: string[]
}

// API request types (matching swagger dto.UpdateRoomDTO)
export interface RoomUpdatePayload {
	title?: string
	capacity?: number
	ratio?: number
	minAge?: number // in months (0-255)
	maxAge?: number // in months (0-255)
	color?: string
	logoId?: string
	status?: string
	studentIds?: string[]
	employeeIds?: string[]
}

// dto.StudentAbsenceRequest - used in POST /students/{studentId}/absence
export interface StudentAbsenceRequest {
	dateFrom: string
	dateTo: string
	reason: string
}

// dto.StudentAbsenceDTO - response from POST /students/{studentId}/absence
export interface StudentAbsenceDTO {
	id: number
	studentId: string
	dateFrom: string
	dateTo: string
	reason: string
}

// API response types (matching swagger dto.*)
export interface ApiAsset {
	id: string
	path: string
}

export interface ApiRoomShort {
	id: string
	title: string
}

export interface ApiParent {
	id: string
	firstName: string
	lastName: string
	avatar?: ApiAsset
}

// dto.StudentDTO - used in RoomDTO.students
export interface ApiStudent {
	id: string
	firstName: string
	lastName: string
	roomId: string
	checkedIn: boolean
	avatar?: ApiAsset
	parents?: ApiParent[]
	tags?: string[]
}

// dto.StudentShortDTO - used in /rooms/all-students-list
export interface ApiStudentShort {
	id: string
	firstName: string
	lastName: string
	roomId: string
	checkedIn: boolean
	avatar?: ApiAsset
}

// dto.EmployeeShortDTO - used in RoomDTO.staff and /rooms/all-employees-list
export interface ApiEmployeeShort {
	id: string
	firstName: string
	lastName: string
	roomId: string
	checkedIn: boolean
	role: string
	status: string
	accountStatus: string
	avatar?: ApiAsset
}

// dto.RoomDTO
export interface ApiRoom {
	id: string
	title: string
	capacity: number
	ratio: number
	minAge: number
	maxAge: number
	status: string
	color?: string
	logo?: ApiAsset
	students?: ApiStudent[]
	staff?: ApiEmployeeShort[] // Uses EmployeeShortDTO, not full EmployeeDTO
}

// dto.RoomListResponse - response from GET /rooms
export interface ApiRoomListResponse {
	items: ApiRoom[]
	total: number
	limit: number
	offset: number
}

// UI types
export interface Room {
	id: string
	name: string
	icon: RoomType
	status: RoomStatus
	capacity: number
	ratio: number
	minAge: number // in months
	maxAge: number // in months
	studentsCount: number
	staffCount: number
	signedInStudents: Student[]
	signedInStaff: StaffMember[]
	logo?: string // URL path to logo image
	color?: string // Gradient color string
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
