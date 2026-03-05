import { apiClient } from "@/services/api.service"

import type { EmployeeDocument, EmployeeFull, GetEmployeesResult, UpdateEmployeePayload } from "../types"

export async function getEmployees(): Promise<GetEmployeesResult> {
	return apiClient.get<GetEmployeesResult>("/employees")
}

export async function getEmployeeById(employeeId: string): Promise<EmployeeFull> {
	return apiClient.get<EmployeeFull>(`/employees/${employeeId}`)
}

export async function updateEmployee(employeeId: string, payload: UpdateEmployeePayload): Promise<EmployeeFull> {
	return apiClient.put<EmployeeFull>(`/employees/${employeeId}`, payload)
}

export async function updateEmployeeAvatar(employeeId: string, avatarFile: File): Promise<EmployeeFull> {
	const formData = new FormData()
	formData.append("avatar", avatarFile)

	return apiClient.put<EmployeeFull>(`/employees/${employeeId}/avatar`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	})
}

export async function getEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]> {
	return apiClient.get<EmployeeDocument[]>(`/employees/${employeeId}/documents`)
}

export async function getEmployeeDocument(employeeId: string, documentId: number): Promise<EmployeeDocument> {
	return apiClient.get<EmployeeDocument>(`/employees/${employeeId}/documents/${documentId}`)
}

export async function uploadEmployeeDocument(
	employeeId: string,
	file: File,
	data: { type: string; expiryDate?: string; notes?: string },
): Promise<EmployeeDocument> {
	const formData = new FormData()
	formData.append("file", file)
	formData.append("type", data.type)
	if (data.expiryDate) formData.append("expiryDate", data.expiryDate)
	if (data.notes) formData.append("notes", data.notes)

	return apiClient.post<EmployeeDocument>(`/employees/${employeeId}/documents`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	})
}

export async function regenerateEmployeePin(employeeId: string): Promise<EmployeeFull> {
	return apiClient.post<EmployeeFull>(`/employees/${employeeId}/pin`)
}

export async function deleteEmployeeDocument(employeeId: string, documentId: number): Promise<void> {
	await apiClient.delete(`/employees/${employeeId}/documents/${documentId}`)
}

export function getEmployeeDocumentDownloadUrl(employeeId: string, documentId: number): string {
	const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api/v1"
	return `${baseUrl}/employees/${employeeId}/documents/${documentId}`
}
