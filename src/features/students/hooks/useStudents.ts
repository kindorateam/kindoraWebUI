import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
	deleteStudentDocument,
	getStudentById,
	getStudentDocuments,
	getStudents,
	uploadStudentDocument,
} from "../services/student.service"

import type { GetStudentsResult, StudentDocument } from "../types"

const DEFAULT_PAGE_SIZE = 10

export interface UseStudentsOptions {
	status?: string
	page?: number
	limit?: number
}

export const useStudents = (options: UseStudentsOptions = {}) => {
	const { status = "active", page = 1, limit = DEFAULT_PAGE_SIZE } = options
	const offset = (page - 1) * limit

	const query = useQuery<GetStudentsResult, Error>({
		queryKey: ["students", { status, page, limit }],
		queryFn: () => getStudents({ status, limit, offset }),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})

	return {
		...query,
		students: query.data?.items ?? [],
		total: query.data?.total ?? 0,
		totalPages: Math.ceil((query.data?.total ?? 0) / limit) || 1,
	}
}

export function useStudent(studentId: string) {
	return useQuery({
		queryKey: ["students", studentId],
		queryFn: () => getStudentById(studentId),
		enabled: !!studentId,
		staleTime: 5 * 60 * 1000,
	})
}

export function useStudentDocuments(studentId: string) {
	return useQuery<StudentDocument[], Error>({
		queryKey: ["students", studentId, "documents"],
		queryFn: () => getStudentDocuments(studentId),
		enabled: !!studentId,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}

export function useUploadStudentDocument() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			studentId,
			file,
			data,
		}: {
			studentId: string
			file: File
			data: { type: string; expiryDate?: string; notes?: string }
		}) => uploadStudentDocument(studentId, file, data),
		onSuccess: (_data, { studentId }) => {
			void queryClient.invalidateQueries({ queryKey: ["students", studentId, "documents"] })
		},
	})
}

export function useDeleteStudentDocument() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ studentId, documentId }: { studentId: string; documentId: number }) =>
			deleteStudentDocument(studentId, documentId),
		onSuccess: (_data, { studentId }) => {
			void queryClient.invalidateQueries({ queryKey: ["students", studentId, "documents"] })
		},
	})
}
