import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createEvent, deleteEvent, getEvents, updateEvent } from "../services/calendar.service"

import type { CreateEventPayload, GetEventsParams, UpdateEventPayload } from "../types"

export const useCalendarEvents = (params: GetEventsParams) => {
	return useQuery({
		queryKey: ["calendar-events", params.start, params.end],
		queryFn: () => getEvents(params),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		enabled: !!params.start && !!params.end,
	})
}

export const useCreateEvent = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateEventPayload) => createEvent(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["calendar-events"] })
		},
	})
}

export const useUpdateEvent = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ eventId, payload }: { eventId: string; payload: UpdateEventPayload }) =>
			updateEvent(eventId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["calendar-events"] })
		},
	})
}

export const useDeleteEvent = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (eventId: string) => deleteEvent(eventId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["calendar-events"] })
		},
	})
}
