import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"

import {
	activateRoom,
	addStudentsToRoom,
	checkInStudent,
	checkOutStudent,
	createRoom,
	getAllEmployees,
	getAllStudents,
	getRoomById,
	getRooms,
	inactivateRoom,
	markStudentAbsent,
	moveStudentsToRoom,
	updateRoom,
	updateRoomLogo,
} from "../services/room.service"

import type { GetRoomsResult, RoomStatus } from "../services/room.service"
import type { AddRoomFormData, Room, RoomUpdatePayload, StudentAbsenceRequest } from "../types"

const DEFAULT_PAGE_SIZE = 10

export interface UseRoomsOptions {
	status?: RoomStatus
	page?: number
	limit?: number
}

/**
 * Hook to fetch rooms from the API using TanStack Query with server-side pagination
 */
export const useRooms = (options: UseRoomsOptions = {}) => {
	const { status = "active", page = 1, limit = DEFAULT_PAGE_SIZE } = options
	const offset = (page - 1) * limit

	const query = useQuery<GetRoomsResult, Error>({
		queryKey: ["rooms", { status, page, limit }],
		queryFn: () => getRooms({ status, limit, offset }),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})

	return {
		...query,
		// Convenience accessors
		rooms: query.data?.rooms ?? [],
		total: query.data?.total ?? 0,
		totalPages: Math.ceil((query.data?.total ?? 0) / limit) || 1,
	}
}

/**
 * Hook to fetch a single room by ID from the API using TanStack Query
 */
export const useRoom = (roomId: string) => {
	const queryClient = useQueryClient()

	return useQuery<Room, Error>({
		queryKey: ["rooms", roomId],
		queryFn: () => getRoomById(roomId),
		placeholderData: () => {
			// Search all cached room list pages for this room
			const cache = queryClient.getQueriesData<GetRoomsResult>({
				predicate: (query) => {
					const key = query.queryKey
					return key[0] === "rooms" && typeof key[1] === "object" && key[1] !== null && "status" in key[1]
				},
			})
			for (const [, data] of cache) {
				const found = data?.rooms.find((room) => room.id === roomId)
				if (found) return found
			}
			return undefined
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!roomId, // Only run query if roomId is provided
	})
}

/**
 * Hook to create a new room using TanStack Query mutation
 */
export const useCreateRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (formData: AddRoomFormData) => {
			// Check if avatarPreview is a gradient color (not a file preview URL)
			const isGradient = formData.avatarPreview?.startsWith("linear-gradient")

			// Step 1: Create the room
			const room = await createRoom({
				title: formData.name,
				capacity: formData.capacity,
				ratio: formData.ratio,
				minAge: formData.minAge,
				maxAge: formData.maxAge,
				studentIds: formData.studentIds,
				employeeIds: formData.staffIds,
				...(isGradient && { color: formData.avatarPreview }),
			})

			// Step 2: If there's a logo file, upload it after room creation
			if (formData.avatarFile) {
				return updateRoomLogo(room.id, formData.avatarFile)
			}

			return room
		},
		onSuccess: () => {
			// Invalidate all active rooms pages (new rooms are always active)
			queryClient.invalidateQueries({
				predicate: (query) => {
					const key = query.queryKey
					return (
						key[0] === "rooms" &&
						typeof key[1] === "object" &&
						key[1] !== null &&
						"status" in key[1] &&
						key[1].status === "active"
					)
				},
			})
		},
	})
}

/**
 * Hook to fetch all employees for room staff assignment
 */
export const useAllEmployees = () => {
	return useQuery({
		queryKey: ["rooms", "all-employees"],
		queryFn: getAllEmployees,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}

/**
 * Hook to fetch all students for room assignment
 * @param enabled - Whether to fetch students (defaults to true)
 */
export const useAllStudents = (enabled = true) => {
	return useQuery({
		queryKey: ["rooms", "all-students"],
		queryFn: getAllStudents,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		enabled,
	})
}

/**
 * Hook to fetch all students and employees in parallel for room assignment
 * Uses useQueries for proper TanStack Query parallel fetching with separate caches
 */
export const useAllStudentsAndEmployees = () => {
	const results = useQueries({
		queries: [
			{
				queryKey: ["rooms", "all-students"],
				queryFn: getAllStudents,
				staleTime: 5 * 60 * 1000,
				gcTime: 10 * 60 * 1000,
			},
			{
				queryKey: ["rooms", "all-employees"],
				queryFn: getAllEmployees,
				staleTime: 5 * 60 * 1000,
				gcTime: 10 * 60 * 1000,
			},
		],
	})

	const [studentsQuery, employeesQuery] = results

	return {
		students: studentsQuery.data ?? [],
		employees: employeesQuery.data ?? [],
		isLoading: studentsQuery.isLoading || employeesQuery.isLoading,
		isError: studentsQuery.isError || employeesQuery.isError,
		error: studentsQuery.error || employeesQuery.error,
		refetchStudents: studentsQuery.refetch,
		refetchEmployees: employeesQuery.refetch,
		refetchAll: () => Promise.all([studentsQuery.refetch(), employeesQuery.refetch()]),
	}
}

/**
 * Hook to deactivate a room using TanStack Query mutation (soft delete)
 */
export const useInactivateRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (roomId: string) => inactivateRoom(roomId),
		onSuccess: (_data, roomId) => {
			// Room moves from active to inactive, invalidate both lists and individual room
			queryClient.invalidateQueries({
				predicate: (query) => {
					const key = query.queryKey
					if (key[0] !== "rooms") return false
					// Invalidate individual room query
					if (key[1] === roomId) return true
					// Invalidate all paginated room lists (both active and inactive)
					if (typeof key[1] === "object" && key[1] !== null && "status" in key[1]) return true
					return false
				},
			})
		},
	})
}

/**
 * Hook to activate an inactive room using TanStack Query mutation
 */
export const useActivateRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (roomId: string) => activateRoom(roomId),
		onSuccess: (_data, roomId) => {
			// Room moves from inactive to active, invalidate both lists and individual room
			queryClient.invalidateQueries({
				predicate: (query) => {
					const key = query.queryKey
					if (key[0] !== "rooms") return false
					// Invalidate individual room query
					if (key[1] === roomId) return true
					// Invalidate all paginated room lists (both active and inactive)
					if (typeof key[1] === "object" && key[1] !== null && "status" in key[1]) return true
					return false
				},
			})
		},
	})
}

export interface StudentCheckParams {
	roomId: string
	studentId: string
}

/**
 * Invalidates room queries (individual room and room lists)
 */
const invalidateRoomQueries = (queryClient: ReturnType<typeof useQueryClient>, roomId: string) => {
	// Invalidate individual room
	queryClient.invalidateQueries({ queryKey: ["rooms", roomId] })
	// Invalidate room lists (they contain student data)
	queryClient.invalidateQueries({
		predicate: (query) => {
			const key = query.queryKey
			return key[0] === "rooms" && typeof key[1] === "object" && key[1] !== null && "status" in key[1]
		},
	})
}

/**
 * Hook to check in a student to a room
 */
export const useCheckInStudent = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ roomId, studentId }: StudentCheckParams) => checkInStudent(roomId, studentId),
		onSuccess: (_data, { roomId }) => {
			invalidateRoomQueries(queryClient, roomId)
		},
	})
}

/**
 * Hook to check out a student from a room
 */
export const useCheckOutStudent = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ roomId, studentId }: StudentCheckParams) => checkOutStudent(roomId, studentId),
		onSuccess: (_data, { roomId }) => {
			invalidateRoomQueries(queryClient, roomId)
		},
	})
}

export interface MarkStudentAbsentParams {
	studentId: string
	payload: StudentAbsenceRequest
}

/**
 * Hook to mark a student as absent for a date range
 */
export const useMarkStudentAbsent = () => {
	return useMutation({
		mutationFn: ({ studentId, payload }: MarkStudentAbsentParams) => markStudentAbsent(studentId, payload),
	})
}

export interface UpdateRoomLogoParams {
	roomId: string
	logoFile: File
}

/**
 * Hook to update a room's logo image
 */
export const useUpdateRoomLogo = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ roomId, logoFile }: UpdateRoomLogoParams) => updateRoomLogo(roomId, logoFile),
		onSuccess: (_data, { roomId }) => {
			invalidateRoomQueries(queryClient, roomId)
		},
	})
}

export interface UpdateRoomParams {
	roomId: string
	payload: RoomUpdatePayload
}

/**
 * Hook to update room details
 */
export const useUpdateRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ roomId, payload }: UpdateRoomParams) => updateRoom(roomId, payload),
		onSuccess: (_data, { roomId }) => {
			invalidateRoomQueries(queryClient, roomId)
		},
	})
}

export interface AddStudentsToRoomParams {
	roomId: string
	studentIds: string[]
	currentStudentIds: string[]
}

/**
 * Hook to add students to a room
 */
export const useAddStudentsToRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ roomId, studentIds, currentStudentIds }: AddStudentsToRoomParams) =>
			addStudentsToRoom(roomId, studentIds, currentStudentIds),
		onSuccess: (_data, { roomId }) => {
			invalidateRoomQueries(queryClient, roomId)
			// Invalidate all students list since students are now assigned to a room
			queryClient.invalidateQueries({ queryKey: ["rooms", "all-students"] })
		},
	})
}

export interface MoveStudentsToRoomParams {
	sourceRoomId: string
	targetRoomId: string
	studentIds: string[]
}

/**
 * Hook to move students from one room to another
 */
export const useMoveStudentsToRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ targetRoomId, studentIds }: MoveStudentsToRoomParams) =>
			moveStudentsToRoom(targetRoomId, studentIds),
		onSuccess: (_data, { sourceRoomId, targetRoomId }) => {
			// Invalidate both source and target rooms
			invalidateRoomQueries(queryClient, sourceRoomId)
			invalidateRoomQueries(queryClient, targetRoomId)
		},
	})
}
