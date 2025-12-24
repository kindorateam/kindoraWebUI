import { apiClient } from "@/services/api.service"

import type { EmployeeFull, EmployeeSummary } from "../types"

export async function getEmployees(): Promise<EmployeeSummary[]> {
	return apiClient.get<EmployeeSummary[]>("/employees")
}

export async function getEmployeeById(employeeId: string): Promise<EmployeeFull> {
	return apiClient.get<EmployeeFull>(`/employees/${employeeId}`)
}
