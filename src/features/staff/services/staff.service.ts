import { apiClient } from "@/services/api.service"

import type { EmployeeDocument, EmployeeFull, GetEmployeesResult, UpdateEmployeePayload } from "../types"

interface ApiEmployeeDocument extends Omit<EmployeeDocument, "expiryDate" | "notes" | "uploadedBy"> {
	expiryDate?: string
	notes?: string
	uploadedBy: { id: string }
}

const toEmployeeDocument = (document: ApiEmployeeDocument): EmployeeDocument => ({
	...document,
	expiryDate: document.expiryDate ?? null,
	notes: document.notes ?? null,
	uploadedBy: document.uploadedBy,
})

export interface GetEmployeesParams {
	status?: "active" | "inactive" | "all"
	limit?: number
	offset?: number
	search?: string
}

export async function getEmployees(params: GetEmployeesParams = {}): Promise<GetEmployeesResult> {
	const { status, limit, offset, search } = params
	return apiClient.get<GetEmployeesResult>("/employees", {
		params: { status, limit, offset, search: search || undefined },
	})
}

export async function getEmployeeById(employeeId: string): Promise<EmployeeFull> {
	return apiClient.get<EmployeeFull>(`/employees/${employeeId}`)
}

export async function updateEmployee(employeeId: string, payload: UpdateEmployeePayload): Promise<EmployeeFull> {
	return apiClient.put<EmployeeFull>(`/employees/${employeeId}`, payload)
}

export async function updateEmployeeAvatar(employeeId: string, avatarFile: File): Promise<EmployeeFull> {
	const formData = new FormData()
	formData.append("file", avatarFile)

	return apiClient.put<EmployeeFull>(`/employees/${employeeId}/avatar`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	})
}

export async function getEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]> {
	const documents = await apiClient.get<ApiEmployeeDocument[]>(`/employees/${employeeId}/documents`)
	return documents.map(toEmployeeDocument)
}

export async function getEmployeeDocument(employeeId: string, documentId: number): Promise<EmployeeDocument> {
	const document = await apiClient.get<ApiEmployeeDocument>(`/employees/${employeeId}/documents/${documentId}`)
	return toEmployeeDocument(document)
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

	const document = await apiClient.post<ApiEmployeeDocument>(`/employees/${employeeId}/documents`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	})
	return toEmployeeDocument(document)
}

export async function regenerateEmployeePin(employeeId: string): Promise<{ pinCode: number }> {
	return apiClient.post<{ pinCode: number }>(`/employees/${employeeId}/pin`)
}

export async function deleteEmployeeDocument(employeeId: string, documentId: number): Promise<void> {
	await apiClient.delete(`/employees/${employeeId}/documents/${documentId}`)
}
