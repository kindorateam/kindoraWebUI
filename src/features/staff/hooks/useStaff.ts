import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { QUERY_DEFAULTS } from "@/services/query.constants"

import {
	deleteEmployeeDocument,
	getEmployeeById,
	getEmployeeDocument,
	getEmployeeDocuments,
	getEmployees,
	regenerateEmployeePin,
	updateEmployee,
	updateEmployeeAvatar,
	uploadEmployeeDocument,
} from "../services/staff.service"

import type { EmployeeDocument, GetEmployeesResult, PinVisibility, UpdateEmployeePayload } from "../types"

export interface UseEmployeesOptions {
	status?: "active" | "inactive" | "all"
	page?: number
	limit?: number
	search?: string
}

export const getEmployeeQueryOptions = (employeeId: string) =>
	queryOptions({
		queryKey: ["employees", employeeId] as const,
		queryFn: () => getEmployeeById(employeeId),
		...QUERY_DEFAULTS,
	})

export function useEmployees(options: UseEmployeesOptions = {}) {
	const { status = "active", page = 1, limit = 10, search } = options
	const offset = (page - 1) * limit

	const query = useQuery<GetEmployeesResult, Error>({
		queryKey: ["employees", { status, page, limit, search }],
		queryFn: () => getEmployees({ status, limit, offset, search }),
		...QUERY_DEFAULTS,
	})

	return {
		...query,
		data: query.data?.items ?? [],
		total: query.data?.total ?? 0,
		totalPages: Math.ceil((query.data?.total ?? 0) / limit) || 1,
	}
}

export function useEmployee(employeeId: string) {
	return useQuery({
		...getEmployeeQueryOptions(employeeId),
		enabled: !!employeeId,
	})
}

export function useEmployeeDocuments(employeeId: string) {
	return useQuery<EmployeeDocument[], Error>({
		queryKey: ["employees", employeeId, "documents"],
		queryFn: () => getEmployeeDocuments(employeeId),
		...QUERY_DEFAULTS,
		enabled: !!employeeId,
	})
}

export function useEmployeeDocument(employeeId: string, documentId: number) {
	return useQuery<EmployeeDocument, Error>({
		queryKey: ["employees", employeeId, "documents", documentId],
		queryFn: () => getEmployeeDocument(employeeId, documentId),
		...QUERY_DEFAULTS,
		enabled: !!employeeId && !!documentId,
	})
}

export function useUpdateEmployee() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ employeeId, payload }: { employeeId: string; payload: UpdateEmployeePayload }) =>
			updateEmployee(employeeId, payload),
		onSuccess: (_data, { employeeId }) => {
			void queryClient.invalidateQueries({ queryKey: ["employees", employeeId] })
			void queryClient.invalidateQueries({ queryKey: ["employees"] })
		},
	})
}

export function useUpdateEmployeeAvatar() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ employeeId, avatarFile }: { employeeId: string; avatarFile: File }) =>
			updateEmployeeAvatar(employeeId, avatarFile),
		onSuccess: (_data, { employeeId }) => {
			void queryClient.invalidateQueries({ queryKey: ["employees", employeeId] })
			void queryClient.invalidateQueries({ queryKey: ["employees"] })
		},
	})
}

export function useUploadEmployeeDocument() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			employeeId,
			file,
			data,
		}: {
			employeeId: string
			file: File
			data: { type: string; expiryDate?: string; notes?: string }
		}) => uploadEmployeeDocument(employeeId, file, data),
		onSuccess: (_data, { employeeId }) => {
			void queryClient.invalidateQueries({ queryKey: ["employees", employeeId, "documents"] })
		},
	})
}

export function useRegenerateEmployeePin() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ employeeId }: { employeeId: string }) => regenerateEmployeePin(employeeId),
		onSuccess: (_data, { employeeId }) => {
			void queryClient.invalidateQueries({ queryKey: ["employees", employeeId] })
			void queryClient.invalidateQueries({ queryKey: ["employees"] })
		},
	})
}

export function useDeleteEmployeeDocument() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ employeeId, documentId }: { employeeId: string; documentId: number }) =>
			deleteEmployeeDocument(employeeId, documentId),
		onSuccess: (_data, { employeeId }) => {
			void queryClient.invalidateQueries({ queryKey: ["employees", employeeId, "documents"] })
		},
	})
}

export function usePinVisibility() {
	const [pinVisibility, setPinVisibility] = useState<PinVisibility>({})

	const togglePinVisibility = (employeeId: string) => {
		setPinVisibility((prev) => ({
			...prev,
			[employeeId]: !prev[employeeId],
		}))
	}

	const isPinVisible = (employeeId: string): boolean => {
		return pinVisibility[employeeId] ?? false
	}

	return {
		isPinVisible,
		togglePinVisibility,
	}
}
