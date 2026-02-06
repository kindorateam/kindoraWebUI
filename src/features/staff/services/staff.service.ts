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

// TODO: Remove mock data and restore API call
// return apiClient.get<EmployeeDocument[]>(`/employees/${employeeId}/documents`)
export async function getEmployeeDocuments(_employeeId: string): Promise<EmployeeDocument[]> {
	return [
		{
			id: "1",
			employeeId: _employeeId,
			name: "Teaching Certificate",
			status: "active",
			expiryDate: "2026-09-15",
			type: "Certificate",
			note: null,
			uploadedAt: "2025-01-10",
			uploadedBy: "Admin User",
		},
		{
			id: "2",
			employeeId: _employeeId,
			name: "First Aid Training",
			status: "expiring_soon",
			expiryDate: "2026-03-01",
			type: "Training",
			note: "Renewal recommended",
			uploadedAt: "2024-03-01",
			uploadedBy: "HR Manager",
		},
		{
			id: "3",
			employeeId: _employeeId,
			name: "Background Check",
			status: "expired",
			expiryDate: "2025-12-01",
			type: "Compliance",
			note: "Needs renewal",
			uploadedAt: "2023-12-01",
			uploadedBy: null,
		},
		{
			id: "4",
			employeeId: _employeeId,
			name: "CPR Certification",
			status: "active",
			expiryDate: "2027-06-30",
			type: "Certificate",
			note: null,
			uploadedAt: "2025-06-30",
			uploadedBy: "Admin User",
		},
		{
			id: "5",
			employeeId: _employeeId,
			name: "Resume",
			status: "uploaded",
			expiryDate: null,
			type: "Personal",
			note: "Latest version",
			uploadedAt: "2025-01-05",
			uploadedBy: "Jane Doe",
		},
	]
}
