import type { RoomType } from "@/features/rooms/types"

export interface Student {
	id: string
	name: string
	avatar: string
	dob: string
	parents: Parent[]
	guardian?: Guardian
	medical: MedicalInfo
	rooms: StudentRoom[]
	tags: Tag[]
	status?: string
}

export interface Parent {
	id: string
	name: string
	avatar?: string
	relationship: "Mother" | "Father" | "Guardian"
	email: string
	phone: string
	pin: string
}

export interface StudentRoom {
	id: string
	name: string
	icon: RoomType
}

export interface Tag {
	id: string
	name: string
	color: string
}

export interface Guardian {
	name: string
	phone: string
	pin: string
}

export interface MedicalInfo {
	allergies: string[]
	doctor: {
		name: string
		phone: string
	}
}
