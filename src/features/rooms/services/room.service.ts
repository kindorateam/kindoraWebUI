import { apiClient } from "@/services/api.service"

import type {
	ApiEmployeeMinimalDTO,
	ApiEmployeeShort,
	ApiPaginatedResponse,
	ApiRoom,
	ApiRoomListResponse,
	ApiStudent,
	ApiStudentMinimalDTO,
	EmployeeOption,
	Room,
	RoomCreatePayload,
	RoomUpdatePayload,
	StaffMember,
	Student,
	StudentOption,
} from "../types"

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
		firstName: p.firstName,
		lastName: p.lastName,
		avatar: p.avatar?.path,
		relationship: p.relationship,
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
 * Updates an existing room
 */
export const updateRoom = async (roomId: string, payload: RoomUpdatePayload): Promise<Room> => {
	const apiRoom = await apiClient.put<ApiRoom>(`/rooms/${roomId}`, payload)
	return transformApiRoom(apiRoom)
}

/**
 * Transforms API student minimal DTO to UI option format
 */
const transformStudentMinimal = (apiStudent: ApiStudentMinimalDTO): StudentOption => ({
	id: apiStudent.id,
	name: `${apiStudent.firstName} ${apiStudent.lastName}`,
})

/**
 * Transforms API employee minimal DTO to UI option format
 */
const transformEmployeeMinimal = (apiEmployee: ApiEmployeeMinimalDTO): EmployeeOption => ({
	id: apiEmployee.id,
	name: `${apiEmployee.firstName} ${apiEmployee.lastName}`,
})

export interface PaginationParams {
	limit?: number
	offset?: number
}

export interface PaginatedResult<T> {
	items: T[]
	total: number
	limit: number
	offset: number
}

/**
 * Fetches students with pagination for room assignment
 */
export const getStudentsPaginated = async (params: PaginationParams = {}): Promise<PaginatedResult<StudentOption>> => {
	const { limit = 10, offset = 0 } = params
	const response = await apiClient.get<ApiPaginatedResponse<ApiStudentMinimalDTO>>("/rooms/all-students-list", {
		params: { limit, offset },
	})
	return {
		items: response.items.map(transformStudentMinimal),
		total: response.total,
		limit: response.limit,
		offset: response.offset,
	}
}

/**
 * Fetches employees with pagination for room assignment
 */
export const getEmployeesPaginated = async (
	params: PaginationParams = {},
): Promise<PaginatedResult<EmployeeOption>> => {
	const { limit = 10, offset = 0 } = params
	const response = await apiClient.get<ApiPaginatedResponse<ApiEmployeeMinimalDTO>>("/rooms/all-employees-list", {
		params: { limit, offset },
	})
	return {
		items: response.items.map(transformEmployeeMinimal),
		total: response.total,
		limit: response.limit,
		offset: response.offset,
	}
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

/**
 * Adds students to a room and makes it their primary room
 */
export const addStudentsToRoom = async (roomId: string, studentIds: string[]): Promise<void> => {
	await apiClient.post(`/rooms/${roomId}/students/add`, { ids: studentIds })
	await apiClient.post(`/rooms/${roomId}/students/set-primary`, { ids: studentIds })
}

/**
 * Moves students to a different room.
 * The API has no atomic move — add to target first so a capacity conflict
 * aborts before anything is removed from the source room.
 */
export const moveStudentsToRoom = async (
	sourceRoomId: string,
	targetRoomId: string,
	studentIds: string[],
): Promise<void> => {
	await apiClient.post(`/rooms/${targetRoomId}/students/add`, { ids: studentIds })
	await apiClient.post(`/rooms/${targetRoomId}/students/set-primary`, { ids: studentIds })
	await apiClient.post(`/rooms/${sourceRoomId}/students/remove`, { ids: studentIds })
}
