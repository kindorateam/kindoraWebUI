import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"

import {
	deleteEmployeeDocument,
	getEmployeeById,
	getEmployeeDocument,
	getEmployeeDocuments,
	getEmployees,
	updateEmployee,
	updateEmployeeAvatar,
	uploadEmployeeDocument,
} from "../services/staff.service"

import type { EmployeeDocument, EmployeeFull, GetEmployeesResult, PinVisibility, UpdateEmployeePayload } from "../types"

export function useEmployees() {
	const query = useQuery<GetEmployeesResult, Error>({
		queryKey: ["employees"],
		queryFn: getEmployees,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})

	return {
		...query,
		data: query.data?.items ?? [],
		total: query.data?.total ?? 0,
	}
}

export function useEmployee(employeeId: string) {
	return useQuery<EmployeeFull, Error>({
		queryKey: ["employees", employeeId],
		queryFn: () => getEmployeeById(employeeId),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		enabled: !!employeeId,
	})
}

export function useEmployeeDocuments(employeeId: string) {
	return useQuery<EmployeeDocument[], Error>({
		queryKey: ["employees", employeeId, "documents"],
		queryFn: () => getEmployeeDocuments(employeeId),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		enabled: !!employeeId,
	})
}

export function useEmployeeDocument(employeeId: string, documentId: number) {
	return useQuery<EmployeeDocument, Error>({
		queryKey: ["employees", employeeId, "documents", documentId],
		queryFn: () => getEmployeeDocument(employeeId, documentId),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
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
			void queryClient.invalidateQueries({ queryKey: ["employees"], exact: true })
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
			void queryClient.invalidateQueries({ queryKey: ["employees"], exact: true })
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

	const togglePinVisibility = useCallback((employeeId: string) => {
		setPinVisibility((prev) => ({
			...prev,
			[employeeId]: !prev[employeeId],
		}))
	}, [])

	const isPinVisible = useCallback(
		(employeeId: string): boolean => {
			return pinVisibility[employeeId] ?? false
		},
		[pinVisibility],
	)

	return {
		isPinVisible,
		togglePinVisibility,
	}
}
