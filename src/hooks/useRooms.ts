import { useQuery } from "@tanstack/react-query"

import { fetchRoomsFromApi } from "@/services/room.service"
import type { ApiRoom } from "@/types/room"

/**
 * Hook to fetch rooms from the API using TanStack Query
 * @returns Query result with rooms data, loading state, and error
 */
export const useRooms = () => {
	return useQuery<ApiRoom[], Error>({
		queryKey: ["rooms"],
		queryFn: fetchRoomsFromApi,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
	})
}
