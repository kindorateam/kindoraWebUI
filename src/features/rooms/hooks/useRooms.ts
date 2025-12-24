import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"

import {
	createRoom,
	getAllEmployees,
	getAllStudents,
	getRoomById,
	getRooms,
	inactivateRoom,
} from "../services/room.service"

import type { RoomStatus } from "../services/room.service"
import type { AddRoomFormData, Room } from "../types"

/**
 * Hook to fetch all rooms from the API using TanStack Query
 */
export const useRooms = (status: RoomStatus = "active") => {
	return useQuery<Room[], Error>({
		queryKey: ["rooms", { status }],
		queryFn: () => getRooms({ status }),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
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
			const rooms = queryClient.getQueryData<Room[]>(["rooms"])
			return rooms?.find((room) => room.id === roomId)
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
		mutationFn: (formData: AddRoomFormData) => {
			return createRoom({
				title: formData.name,
				capacity: formData.capacity,
				ratio: formData.ratio,
				minAge: formData.minAge * 12, // Convert years to months
				maxAge: formData.maxAge * 12, // Convert years to months
				studentIds: formData.studentIds,
				employeeIds: formData.staffIds,
			})
		},
		onSuccess: () => {
			// Invalidate rooms list to refetch with new room
			queryClient.invalidateQueries({ queryKey: ["rooms"] })
		},
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
 * Hook to deactivate a room using TanStack Query mutation
 */
export const useInactivateRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (roomId: string) => inactivateRoom(roomId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rooms"] })
		},
	})
}
