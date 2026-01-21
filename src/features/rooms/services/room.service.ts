import { apiClient } from "@/services/api.service"

import type {
	ApiEmployeeShort,
	ApiRoom,
	ApiRoomListResponse,
	ApiStudent,
	ApiStudentShort,
	Room,
	RoomCreatePayload,
	StaffMember,
	Student,
	StudentAbsenceDTO,
	StudentAbsenceRequest,
} from "../types"

/**
 * Transforms API student (short) data to UI format
 */
const transformStudentShort = (apiStudent: ApiStudentShort): Student => ({
	id: apiStudent.id,
	name: `${apiStudent.firstName} ${apiStudent.lastName}`,
	avatar: apiStudent.avatar?.path ?? "/assets/avatars/default.jpg",
	checkedIn: apiStudent.checkedIn,
	parents: [], // Short DTO doesn't include parents
	tags: [], // Short DTO doesn't include tags
})

/**
 * Transforms API student (full) data to UI format
 */
const transformStudent = (apiStudent: ApiStudent): Student => ({
	id: apiStudent.id,
	name: `${apiStudent.firstName} ${apiStudent.lastName}`,
	avatar: apiStudent.avatar?.path ?? "/assets/avatars/default.jpg",
	checkedIn: apiStudent.checkedIn,
	parents: (apiStudent.parents ?? []).map((p) => ({
		id: p.id,
		name: `${p.firstName} ${p.lastName}`,
	})),
	tags: apiStudent.tags ?? [],
})

/**
 * Transforms API employee (short) data to UI staff format
 */
const transformStaff = (apiEmployee: ApiEmployeeShort): StaffMember => ({
	id: apiEmployee.id,
	name: `${apiEmployee.firstName} ${apiEmployee.lastName}`,
	avatar: apiEmployee.avatar?.path ?? "/assets/avatars/default.jpg",
	checkedIn: apiEmployee.checkedIn,
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
		status: apiRoom.status as Room["status"],
		capacity: apiRoom.capacity,
		ratio: apiRoom.ratio,
		minAge: apiRoom.minAge,
		maxAge: apiRoom.maxAge,
		studentsCount: students.length,
		staffCount: staff.length,
		signedInStudents: students.map(transformStudent),
		signedInStaff: staff.map(transformStaff),
		logo: apiRoom.logo?.path,
		color: apiRoom.color,
	}
}

export type RoomStatus = "active" | "inactive" | "all"

export interface GetRoomsParams {
	limit?: number
	offset?: number
	status?: RoomStatus
}

export interface GetRoomsResult {
	rooms: Room[]
	total: number
	limit: number
	offset: number
}

/**
 * Fetches rooms from the API with pagination
 */
export const getRooms = async (params: GetRoomsParams = {}): Promise<GetRoomsResult> => {
	const { limit = 100, offset = 0, status = "active" } = params
	const response = await apiClient.get<ApiRoomListResponse>("/rooms", {
		params: { limit, offset, status },
	})
	return {
		rooms: response.items.map(transformApiRoom),
		total: response.total,
		limit: response.limit,
		offset: response.offset,
	}
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

/**
 * Fetches all students available for room assignment
 */
export const getAllStudents = async (): Promise<Student[]> => {
	const apiStudents = await apiClient.get<ApiStudentShort[]>("/rooms/all-students-list")
	return apiStudents.map(transformStudentShort)
}

/**
 * Fetches all employees available for room assignment
 */
export const getAllEmployees = async (): Promise<StaffMember[]> => {
	const apiEmployees = await apiClient.get<ApiEmployeeShort[]>("/rooms/all-employees-list")
	return apiEmployees.map(transformStaff)
}

/**
 * Deactivates a room by ID (soft delete - can be reversed)
 */
export const inactivateRoom = async (roomId: string): Promise<void> => {
	await apiClient.post(`/rooms/${roomId}/inactivate`)
}

/**
 * Activates an inactive room by ID
 */
export const activateRoom = async (roomId: string): Promise<void> => {
	await apiClient.post(`/rooms/${roomId}/activate`)
}

/**
 * Checks in a student to a room
 */
export const checkInStudent = async (roomId: string, studentId: string): Promise<void> => {
	await apiClient.post(`/rooms/${roomId}/students/${studentId}/check-in`)
}

/**
 * Checks out a student from a room
 */
export const checkOutStudent = async (roomId: string, studentId: string): Promise<void> => {
	await apiClient.post(`/rooms/${roomId}/students/${studentId}/check-out`)
}

/**
 * Marks a student as absent for a date range
 */
export const markStudentAbsent = async (
	studentId: string,
	payload: StudentAbsenceRequest,
): Promise<StudentAbsenceDTO> => {
	return apiClient.post<StudentAbsenceDTO>(`/students/${studentId}/absence`, payload)
}

/**
 * Updates a room's logo image
 */
export const updateRoomLogo = async (roomId: string, logoFile: File): Promise<Room> => {
	const formData = new FormData()
	formData.append("logo", logoFile)

	const apiRoom = await apiClient.put<ApiRoom>(`/rooms/${roomId}/logo`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
	return transformApiRoom(apiRoom)
}
