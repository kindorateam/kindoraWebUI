import { useQuery } from "@tanstack/react-query"

import type { Room } from "@/types/room"

import { getRoomById, getRooms } from "@/services/room.service"

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
