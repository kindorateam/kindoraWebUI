import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getCompanyId } from "@/features/auth/services/token.service"

import { createRoom, getRoomById, getRooms } from "../services/room.service"

import type { AddRoomFormData, Room } from "../types"

/**
 * Hook to fetch all rooms from the API using TanStack Query
 */
export const useRooms = () => {
	return useQuery<Room[], Error>({
		queryKey: ["rooms"],
		queryFn: getRooms,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}

/**
 * Hook to fetch a single room by ID from the API using TanStack Query
 */
export const useRoom = (roomId: string) => {
	return useQuery<Room, Error>({
		queryKey: ["rooms", roomId],
		queryFn: () => getRoomById(roomId),
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
			const companyId = getCompanyId()
			if (!companyId) {
				throw new Error("Company ID not found. Please log in again.")
			}

			return createRoom({
				companyId,
				title: formData.name,
				capacity: formData.capacity,
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
