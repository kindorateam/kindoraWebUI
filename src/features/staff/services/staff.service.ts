import { apiClient } from "@/services/api.service"

import type { EmployeeDocument, EmployeeFull, GetEmployeesResult, UpdateEmployeePayload } from "../types"

const DOCUMENT_TYPES = [
	"Employment Contract",
	"Background Check",
	"CPR Certification",
	"First Aid Certificate",
	"Teaching License",
	"ID Copy",
	"Tax Form W-4",
	"Health Clearance",
	"TB Test Results",
	"Training Certificate",
] as const

const MOCK_EMPLOYEE_DOCUMENTS: Record<string, EmployeeDocument[]> = {}

function getOrCreateMockDocuments(employeeId: string): EmployeeDocument[] {
	if (!MOCK_EMPLOYEE_DOCUMENTS[employeeId]) {
		MOCK_EMPLOYEE_DOCUMENTS[employeeId] = DOCUMENT_TYPES.map((type, i) => ({
			id: Number.parseInt(employeeId.replace(/\D/g, "") || "1", 10) * 100 + i + 1,
			employeeId,
			media: {
				id: `doc-${employeeId}-${i + 1}`,
				path: `/mock/employee-documents/${employeeId}/${type.toLowerCase().replace(/ /g, "-")}.pdf`,
			},
			status: i % 5 === 0 ? "expiring_soon" : i % 7 === 0 ? "expired" : i % 3 === 0 ? "uploaded" : "active",
			expiryDate:
				i % 4 === 0
					? "2026-04-15"
					: i % 3 === 0
						? null
						: `2027-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
			type,
			notes: i % 2 === 0 ? `Notes for ${type}` : null,
			uploadedAt: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}T10:00:00.000Z`,
			uploadedBy: { id: "admin-1", name: "John Jackson" },
		}))
	}
	// biome-ignore lint/style/noNonNullAssertion: initialized above
	return MOCK_EMPLOYEE_DOCUMENTS[employeeId]!
}

export async function getEmployees(status?: "active" | "inactive" | "all"): Promise<GetEmployeesResult> {
	return apiClient.get<GetEmployeesResult>("/employees", { params: { status } })
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
	// TODO: Replace with real API call
	// return apiClient.get<EmployeeDocument[]>(`/employees/${employeeId}/documents`)
	await new Promise((resolve) => setTimeout(resolve, 300))
	return [...getOrCreateMockDocuments(employeeId)]
}

export async function getEmployeeDocument(employeeId: string, documentId: number): Promise<EmployeeDocument> {
	// TODO: Replace with real API call
	// return apiClient.get<EmployeeDocument>(`/employees/${employeeId}/documents/${documentId}`)
	await new Promise((resolve) => setTimeout(resolve, 300))
	const doc = getOrCreateMockDocuments(employeeId).find((d) => d.id === documentId)
	if (!doc) throw new Error(`Document ${documentId} not found`)
	return doc
}

export async function uploadEmployeeDocument(
	employeeId: string,
	file: File,
	data: { type: string; expiryDate?: string; notes?: string },
): Promise<EmployeeDocument> {
	// TODO: Replace with real API call
	await new Promise((resolve) => setTimeout(resolve, 300))

	const uploaded: EmployeeDocument = {
		id: Date.now(),
		employeeId,
		media: {
			id: crypto.randomUUID(),
			path: URL.createObjectURL(file),
		},
		status: "uploaded",
		expiryDate: data.expiryDate ?? null,
		type: data.type,
		notes: data.notes ?? null,
		uploadedAt: new Date().toISOString(),
		uploadedBy: { id: "admin-1", name: "John Jackson" },
	}

	MOCK_EMPLOYEE_DOCUMENTS[employeeId] = [uploaded, ...getOrCreateMockDocuments(employeeId)]
	return uploaded
}

export async function regenerateEmployeePin(employeeId: string): Promise<EmployeeFull> {
	return apiClient.post<EmployeeFull>(`/employees/${employeeId}/pin`)
}

export async function deleteEmployeeDocument(employeeId: string, documentId: number): Promise<void> {
	// TODO: Replace with real API call
	// await apiClient.delete(`/employees/${employeeId}/documents/${documentId}`)
	await new Promise((resolve) => setTimeout(resolve, 300))
	MOCK_EMPLOYEE_DOCUMENTS[employeeId] = getOrCreateMockDocuments(employeeId).filter((d) => d.id !== documentId)
}

export function getEmployeeDocumentDownloadUrl(employeeId: string, documentId: number): string {
	const doc = getOrCreateMockDocuments(employeeId).find((d) => d.id === documentId)
	return doc?.media.path ?? ""
}
