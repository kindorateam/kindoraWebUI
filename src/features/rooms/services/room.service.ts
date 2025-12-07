import { apiClient } from "@/services/api.service"

import type { ApiRoom, ApiStaff, ApiStudent, Room, RoomCreatePayload, StaffMember, Student } from "../types"

/**
 * Transforms API student data to UI format
 */
const transformStudent = (apiStudent: ApiStudent): Student => ({
	id: apiStudent.id,
	name: `${apiStudent.firstname} ${apiStudent.lastname}`,
	avatar: apiStudent.avatar?.path ?? "/assets/avatars/default.jpg",
	checkedIn: apiStudent.checkedIn,
	parents: (apiStudent.parents ?? []).map((p) => ({
		id: p.id,
		name: `${p.firstname} ${p.lastname}`,
	})),
	tags: apiStudent.tags ?? [],
})

/**
 * Transforms API staff data to UI format
 */
const transformStaff = (apiStaff: ApiStaff): StaffMember => ({
	id: apiStaff.id,
	name: `${apiStaff.firstname} ${apiStaff.lastname}`,
	avatar: apiStaff.avatar?.path ?? "/assets/avatars/default.jpg",
	checkedIn: apiStaff.checkedIn,
})

/**
 * Transforms API room data to UI format
 * Maps logo path to icon name (temporary until we have proper icon mapping)
 */
export const transformApiRoom = (apiRoom: ApiRoom): Room => {
	const students = apiRoom.students ?? []
	const staff = apiRoom.staff ?? []

	return {
		id: apiRoom.id,
		name: apiRoom.title,
		// TODO: Map logo to proper icon type based on logo path or add icon field to API
		icon: "turtle", // Default icon for now
		capacity: apiRoom.capacity,
		ratio: apiRoom.ratio,
		studentsCount: students.length,
		staffCount: staff.length,
		signedInStudents: students.map(transformStudent),
		signedInStaff: staff.map(transformStaff),
	}
}

/**
 * Fetches all rooms from the API
 */
export const getRooms = async (): Promise<Room[]> => {
	const apiRooms = await apiClient.get<ApiRoom[]>("/rooms")
	return apiRooms.map(transformApiRoom)
}

/**
 * Fetches a single room by ID from the API
 */
export const getRoomById = async (roomId: string): Promise<Room> => {
	const apiRoom = await apiClient.get<ApiRoom>(`/rooms/${roomId}`)
	return transformApiRoom(apiRoom)
}

/**
 * Creates a new room
 */
export const createRoom = async (payload: RoomCreatePayload): Promise<Room> => {
	const apiRoom = await apiClient.post<ApiRoom>("/rooms", payload)
	return transformApiRoom(apiRoom)
}
