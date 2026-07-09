import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { QUERY_DEFAULTS } from "@/services/query.constants"

import {
	activateStudent,
	createStudent,
	createStudentAbsence,
	deactivateStudent,
	deleteStudent,
	deleteStudentAbsence,
	deleteStudentDocument,
	getStudentAbsences,
	getStudentById,
	getStudentDocument,
	getStudentDocuments,
	getStudents,
	updateStudent,
	updateStudentAvatar,
	updateStudentDocument,
	uploadStudentDocument,
} from "../services/student.service"

import type {
	CreateStudentPayload,
	StudentAbsencePayload,
	StudentDocumentPayload,
	UpdateStudentDocumentPayload,
	UpdateStudentPayload,
} from "../services/student.service"
import type { GetStudentsResult, StudentAbsence, StudentDocument } from "../types"

const DEFAULT_PAGE_SIZE = 10

export interface UseStudentsOptions {
	status?: string
	page?: number
	limit?: number
	search?: string
}

export const getStudentQueryOptions = (studentId: string) =>
	queryOptions({
		queryKey: ["students", studentId] as const,
		queryFn: () => getStudentById(studentId),
		...QUERY_DEFAULTS,
	})

export const useStudents = (options: UseStudentsOptions = {}) => {
	const { status = "active", page = 1, limit = DEFAULT_PAGE_SIZE, search } = options
	const offset = (page - 1) * limit

	const query = useQuery<GetStudentsResult, Error>({
		queryKey: ["students", { status, page, limit, search }],
		queryFn: () => getStudents({ status, limit, offset, search }),
		...QUERY_DEFAULTS,
	})

	return {
		...query,
		students: query.data?.items ?? [],
		total: query.data?.total ?? 0,
		totalPages: Math.ceil((query.data?.total ?? 0) / limit) || 1,
	}
}

const invalidateStudentQueries = (queryClient: ReturnType<typeof useQueryClient>, studentId?: string) => {
	void queryClient.invalidateQueries({ queryKey: ["students"] })
	if (studentId) {
		void queryClient.invalidateQueries({ queryKey: ["students", studentId] })
	}
}

export function useStudent(studentId: string) {
	return useQuery({
		...getStudentQueryOptions(studentId),
		enabled: !!studentId,
	})
}

export function useCreateStudent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ payload, avatarFile }: { payload: CreateStudentPayload; avatarFile?: File }) =>
			createStudent(payload, avatarFile),
		onSuccess: () => {
			invalidateStudentQueries(queryClient)
		},
	})
}

export function useUpdateStudent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ studentId, payload }: { studentId: string; payload: UpdateStudentPayload }) =>
			updateStudent(studentId, payload),
		onSuccess: (_data, { studentId }) => {
			invalidateStudentQueries(queryClient, studentId)
		},
	})
}

export function useDeleteStudent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (studentId: string) => deleteStudent(studentId),
		onSuccess: () => {
			invalidateStudentQueries(queryClient)
		},
	})
}

export function useActivateStudent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (studentId: string) => activateStudent(studentId),
		onSuccess: (_data, studentId) => {
			invalidateStudentQueries(queryClient, studentId)
		},
	})
}

export function useDeactivateStudent() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (studentId: string) => deactivateStudent(studentId),
		onSuccess: (_data, studentId) => {
			invalidateStudentQueries(queryClient, studentId)
		},
	})
}

export function useUpdateStudentAvatar() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ studentId, avatarFile }: { studentId: string; avatarFile: File }) =>
			updateStudentAvatar(studentId, avatarFile),
		onSuccess: (_data, { studentId }) => {
			invalidateStudentQueries(queryClient, studentId)
		},
	})
}

export function useStudentAbsences(studentId: string) {
	return useQuery<StudentAbsence[], Error>({
		queryKey: ["students", studentId, "absences"],
		queryFn: () => getStudentAbsences(studentId),
		enabled: !!studentId,
		...QUERY_DEFAULTS,
	})
}

export function useCreateStudentAbsence() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ studentId, payload }: { studentId: string; payload: StudentAbsencePayload }) =>
			createStudentAbsence(studentId, payload),
		onSuccess: (_data, { studentId }) => {
			invalidateStudentQueries(queryClient, studentId)
			void queryClient.invalidateQueries({ queryKey: ["students", studentId, "absences"] })
		},
	})
}

export function useDeleteStudentAbsence() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ studentId, absenceId }: { studentId: string; absenceId: number }) =>
			deleteStudentAbsence(studentId, absenceId),
		onSuccess: (_data, { studentId }) => {
			invalidateStudentQueries(queryClient, studentId)
			void queryClient.invalidateQueries({ queryKey: ["students", studentId, "absences"] })
		},
	})
}

export function useStudentDocuments(studentId: string) {
	return useQuery<StudentDocument[], Error>({
		queryKey: ["students", studentId, "documents"],
		queryFn: () => getStudentDocuments(studentId),
		enabled: !!studentId,
		...QUERY_DEFAULTS,
	})
}

export function useStudentDocument(studentId: string, documentId: number | null) {
	return useQuery<StudentDocument, Error>({
		queryKey: ["students", studentId, "documents", documentId],
		queryFn: () => getStudentDocument(studentId, documentId ?? 0),
		enabled: !!studentId && documentId !== null,
		...QUERY_DEFAULTS,
	})
}

export function useUploadStudentDocument() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ studentId, file, data }: { studentId: string; file: File; data: StudentDocumentPayload }) =>
			uploadStudentDocument(studentId, file, data),
		onSuccess: (_data, { studentId }) => {
			void queryClient.invalidateQueries({ queryKey: ["students", studentId, "documents"] })
		},
	})
}

export function useUpdateStudentDocument() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			studentId,
			documentId,
			payload,
		}: {
			studentId: string
			documentId: number
			payload: UpdateStudentDocumentPayload
		}) => updateStudentDocument(studentId, documentId, payload),
		onSuccess: (_data, { studentId, documentId }) => {
			void queryClient.invalidateQueries({ queryKey: ["students", studentId, "documents"] })
			void queryClient.invalidateQueries({ queryKey: ["students", studentId, "documents", documentId] })
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
