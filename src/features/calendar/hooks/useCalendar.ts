import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { QUERY_DEFAULTS } from "@/services/query.constants"

import { createEvent, deleteEvent, getEvents, updateEvent } from "../services/calendar.service"

import type { CreateEventPayload, DeleteEventPayload, GetEventsParams, UpdateEventPayload } from "../types"

export const useCalendarEvents = (params: GetEventsParams) => {
	return useQuery({
		queryKey: ["calendar-events", params.start, params.end],
		queryFn: () => getEvents(params),
		...QUERY_DEFAULTS,
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
		mutationFn: (payload: DeleteEventPayload) => deleteEvent(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["calendar-events"] })
		},
	})
}
