import { useQuery } from "@tanstack/react-query"
import { useCallback, useState } from "react"

import { getEmployeeById, getEmployeeDocuments, getEmployees } from "../services/staff.service"

import type { EmployeeDocument, EmployeeFull, GetEmployeesResult, PinVisibility } from "../types"

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
