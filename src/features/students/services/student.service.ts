import { apiClient } from "@/services/api.service"
import { getMediaUrl } from "@/utils/media"

import type {
	GetStudentsResult,
	ShortMedia,
	Student,
	StudentAbsence,
	StudentDocument,
	StudentDocumentStatus,
	StudentGuardian,
	StudentMedicalInfo,
	StudentParent,
	StudentRoom,
	StudentSibling,
} from "../types"

export interface GetStudentsParams {
	status?: string
	limit?: number
	offset?: number
	search?: string
}

export interface StudentMedicalInfoPayload {
	allergies?: string[]
	medications?: string
	doctorName?: string
	doctorPhone?: string
}

export interface StudentParentPayload {
	parentId?: string
	relationship?: string
	firstName?: string
	lastName?: string
	email?: string
	phone?: string
	isTrustedPerson?: boolean
}

export interface CreateStudentPayload {
	firstName: string
	lastName: string
	birthDate?: string
	dietRestriction?: string
	streetAddress?: string
	city?: string
	state?: string
	zipCode?: string
	enrollDate?: string
	roomId: string
	roomIds?: string[]
	avatarId?: string
	parents?: StudentParentPayload[]
	tags?: string[]
	medicalInfo?: StudentMedicalInfoPayload
}

export interface UpdateStudentPayload {
	firstName?: string
	lastName?: string
	birthDate?: string
	dietRestriction?: string
	streetAddress?: string
	city?: string
	state?: string
	zipCode?: string
	enrollDate?: string
	roomId?: string
	roomIds?: string[]
	avatar?: ShortMedia
	parents?: StudentParentPayload[]
	removeParentIds?: string[]
	tags?: string[]
	medicalInfo?: StudentMedicalInfoPayload
}

export interface StudentAbsencePayload {
	dateFrom: string
	dateTo: string
	reason: string
}

export interface StudentDocumentPayload {
	type: string
	expiryDate?: string
	notes?: string
}

export type UpdateStudentDocumentPayload = Partial<StudentDocumentPayload>

interface ApiStudentListResponse {
	items: ApiStudent[]
	total: number
	limit: number
	offset: number
}

interface ApiStudent {
	id: string
	firstName: string
	lastName: string
	birthDate?: string
	dietRestriction?: string
	streetAddress?: string
	city?: string
	state?: string
	zipCode?: string
	enrollDate?: string
	roomId?: string
	room?: StudentRoom | null
	rooms?: StudentRoom[] | null
	avatar?: ShortMedia | null
	checkedIn?: boolean
	parents?: ApiStudentParent[] | null
	tags?: string[] | null
	absence?: StudentAbsence | null
	medicalInfo?: ApiStudentMedicalInfo | null
}

interface ApiStudentProfile extends ApiStudent {
	guardians?: ApiStudentProfileParent[] | null
	parents?: ApiStudentProfileParent[] | null
	siblings?: ApiStudentSibling[] | null
}

interface ApiStudentParent {
	id: string
	firstName: string
	lastName: string
	avatar?: ShortMedia | null
	relationship?: string
}

interface ApiStudentProfileParent extends ApiStudentParent {
	email?: string
	phone?: string
	pinCode?: string
}

interface ApiStudentSibling {
	id: string
	firstName: string
	lastName: string
	birthDate?: string
	avatar?: ShortMedia | null
	rooms?: StudentRoom[] | null
}

interface ApiStudentMedicalInfo {
	allergies?: string[] | null
	medications?: string
	doctorName?: string
	doctorPhone?: string
}

interface ApiStudentDocument {
	id: number
	studentId: string
	media?: ShortMedia
	status?: StudentDocumentStatus
	expiryDate?: string | null
	type?: string
	notes?: string
	uploadedAt?: string
	uploadedBy?: { id?: string; name?: string }
}

const toNullable = <T>(value: T | undefined): T | null => value ?? null

const toParent = (parent: ApiStudentParent): StudentParent => ({
	id: parent.id,
	firstName: parent.firstName,
	lastName: parent.lastName,
	avatar: toNullable(parent.avatar) ?? undefined,
	relationshipToStudent: parent.relationship ?? null,
})

const toProfileParent = (parent: ApiStudentProfileParent): StudentParent => ({
	...toParent(parent),
	email: parent.email ?? null,
	phone: parent.phone ?? null,
	pin: parent.pinCode ?? null,
})

const toGuardian = (guardian: ApiStudentProfileParent): StudentGuardian => ({
	id: guardian.id,
	firstName: guardian.firstName,
	lastName: guardian.lastName,
	avatar: toNullable(guardian.avatar) ?? undefined,
	phone: guardian.phone ?? null,
	pin: guardian.pinCode ?? null,
	relationshipToStudent: guardian.relationship ?? null,
})

const toSibling = (sibling: ApiStudentSibling): StudentSibling => ({
	id: sibling.id,
	firstName: sibling.firstName,
	lastName: sibling.lastName,
	avatar: toNullable(sibling.avatar) ?? undefined,
	dateOfBirth: sibling.birthDate ?? null,
	assignedRoomTitle: sibling.rooms?.[0]?.title ?? null,
})

const toMedicalInfo = (medicalInfo?: ApiStudentMedicalInfo | null): StudentMedicalInfo | undefined => {
	if (!medicalInfo) return undefined

	return {
		allergies: medicalInfo.allergies ?? [],
		medications: medicalInfo.medications ?? null,
		doctor: medicalInfo.doctorName ?? null,
		doctorPhone: medicalInfo.doctorPhone ?? null,
	}
}

const transformStudent = (student: ApiStudent | ApiStudentProfile): Student => ({
	id: student.id,
	firstName: student.firstName,
	lastName: student.lastName,
	avatar: toNullable(student.avatar) ?? undefined,
	roomId: student.roomId ?? "",
	room: student.room ?? student.rooms?.[0],
	checkedIn: student.checkedIn ?? false,
	parents:
		"guardians" in student ? (student.parents ?? []).map(toProfileParent) : (student.parents ?? []).map(toParent),
	tags: student.tags ?? [],
	absence: student.absence ?? undefined,
	birthday: student.birthDate ?? null,
	dietRestriction: student.dietRestriction ?? null,
	state: student.state ?? null,
	city: student.city ?? null,
	streetAddress: student.streetAddress ?? null,
	zipCode: student.zipCode ?? null,
	enrollDate: student.enrollDate ?? null,
	siblings: "siblings" in student ? (student.siblings ?? []).map(toSibling) : [],
	guardians: "guardians" in student ? (student.guardians ?? []).map(toGuardian) : [],
	medicalInfo: toMedicalInfo(student.medicalInfo),
})

const transformStudentDocument = (document: ApiStudentDocument): StudentDocument => ({
	id: document.id,
	studentId: document.studentId,
	media: document.media ?? { id: "", path: "" },
	status: document.status ?? "uploaded",
	expiryDate: document.expiryDate ?? null,
	type: document.type ?? "other",
	notes: document.notes ?? null,
	uploadedAt: document.uploadedAt ?? "",
	uploadedBy: document.uploadedBy?.id
		? {
				id: document.uploadedBy.id,
				name: document.uploadedBy.name ?? "",
			}
		: null,
})

const toRFC3339Date = (date: string): string => {
	if (!date) return date
	if (date.includes("T")) return date
	return new Date(`${date}T00:00:00`).toISOString()
}

const appendArray = (formData: FormData, key: string, values?: string[]) => {
	if (values?.length) {
		formData.append(key, values.join(","))
	}
}

const appendOptional = (formData: FormData, key: string, value?: string) => {
	if (value) {
		formData.append(key, value)
	}
}

const buildCreateStudentFormData = (payload: CreateStudentPayload, avatarFile: File): FormData => {
	const formData = new FormData()
	formData.append("avatar", avatarFile)
	formData.append("firstName", payload.firstName)
	formData.append("lastName", payload.lastName)
	formData.append("roomId", payload.roomId)
	appendOptional(formData, "birthDate", payload.birthDate)
	appendOptional(formData, "dietRestriction", payload.dietRestriction)
	appendOptional(formData, "streetAddress", payload.streetAddress)
	appendOptional(formData, "city", payload.city)
	appendOptional(formData, "state", payload.state)
	appendOptional(formData, "zipCode", payload.zipCode)
	appendOptional(formData, "enrollDate", payload.enrollDate)
	appendOptional(formData, "avatarId", payload.avatarId)
	appendArray(formData, "roomIds", payload.roomIds)
	appendArray(formData, "tags", payload.tags)
	return formData
}

const buildStudentDocumentFormData = (file: File, data: StudentDocumentPayload): FormData => {
	const formData = new FormData()
	formData.append("file", file)
	formData.append("type", data.type)
	if (data.expiryDate) formData.append("expiryDate", toRFC3339Date(data.expiryDate))
	if (data.notes) formData.append("notes", data.notes)
	return formData
}

const normalizeStudentDocumentPayload = (payload: UpdateStudentDocumentPayload): UpdateStudentDocumentPayload => ({
	...payload,
	expiryDate: payload.expiryDate ? toRFC3339Date(payload.expiryDate) : payload.expiryDate,
})

export async function getStudents(params: GetStudentsParams = {}): Promise<GetStudentsResult> {
	const { limit = 10, offset = 0, search } = params
	const response = await apiClient.get<ApiStudentListResponse>("/students", {
		params: { limit, offset, search },
	})

	return {
		items: response.items.map(transformStudent),
		total: response.total,
		limit: response.limit,
		offset: response.offset,
	}
}

export async function createStudent(payload: CreateStudentPayload, avatarFile?: File): Promise<Student> {
	const response = avatarFile
		? await apiClient.post<ApiStudent>("/students", buildCreateStudentFormData(payload, avatarFile), {
				headers: { "Content-Type": "multipart/form-data" },
			})
		: await apiClient.post<ApiStudent>("/students", payload)

	return transformStudent(response)
}

export async function getStudentById(studentId: string): Promise<Student> {
	const response = await apiClient.get<ApiStudentProfile>(`/students/${studentId}`)
	return transformStudent(response)
}

export async function updateStudent(studentId: string, payload: UpdateStudentPayload): Promise<Student> {
	const response = await apiClient.put<ApiStudent>(`/students/${studentId}`, payload)
	return transformStudent(response)
}

export async function deleteStudent(studentId: string): Promise<void> {
	await apiClient.delete(`/students/${studentId}`)
}

export async function activateStudent(studentId: string): Promise<Student> {
	const response = await apiClient.post<ApiStudent>(`/students/${studentId}/activate`)
	return transformStudent(response)
}

export async function deactivateStudent(studentId: string): Promise<Student> {
	const response = await apiClient.post<ApiStudent>(`/students/${studentId}/deactivate`)
	return transformStudent(response)
}

export async function updateStudentAvatar(studentId: string, avatarFile: File): Promise<Student> {
	const formData = new FormData()
	formData.append("avatar", avatarFile)

	const response = await apiClient.put<ApiStudent>(`/students/${studentId}/avatar`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	})

	return transformStudent(response)
}

export async function getStudentAbsences(studentId: string): Promise<StudentAbsence[]> {
	return apiClient.get<StudentAbsence[]>(`/students/${studentId}/absence`)
}

export async function createStudentAbsence(studentId: string, payload: StudentAbsencePayload): Promise<StudentAbsence> {
	return apiClient.post<StudentAbsence>(`/students/${studentId}/absence`, payload)
}

export async function deleteStudentAbsence(studentId: string, absenceId: number): Promise<void> {
	await apiClient.delete(`/students/${studentId}/absence/${absenceId}`)
}

export async function getStudentDocuments(studentId: string): Promise<StudentDocument[]> {
	const response = await apiClient.get<ApiStudentDocument[]>(`/students/${studentId}/documents`)
	return response.map(transformStudentDocument)
}

export async function getStudentDocument(studentId: string, documentId: number): Promise<StudentDocument> {
	const response = await apiClient.get<ApiStudentDocument>(`/students/${studentId}/documents/${documentId}`)
	return transformStudentDocument(response)
}

export async function uploadStudentDocument(
	studentId: string,
	file: File,
	data: StudentDocumentPayload,
): Promise<StudentDocument> {
	const response = await apiClient.post<ApiStudentDocument>(
		`/students/${studentId}/documents`,
		buildStudentDocumentFormData(file, data),
		{
			headers: { "Content-Type": "multipart/form-data" },
		},
	)

	return transformStudentDocument(response)
}

export async function updateStudentDocument(
	studentId: string,
	documentId: number,
	payload: UpdateStudentDocumentPayload,
): Promise<StudentDocument> {
	const response = await apiClient.put<ApiStudentDocument>(
		`/students/${studentId}/documents/${documentId}`,
		normalizeStudentDocumentPayload(payload),
	)

	return transformStudentDocument(response)
}

export async function deleteStudentDocument(studentId: string, documentId: number): Promise<void> {
	await apiClient.delete(`/students/${studentId}/documents/${documentId}`)
}

export function getStudentDocumentDownloadUrl(document: StudentDocument): string {
	return document.media.path ? getMediaUrl(document.media.path) : ""
}
