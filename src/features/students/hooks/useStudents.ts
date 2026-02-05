import { useQuery } from "@tanstack/react-query"

import { getStudents } from "../services/student.service"

import type { GetStudentsResult } from "../types"

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
