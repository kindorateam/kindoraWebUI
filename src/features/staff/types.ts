// API Response Types - Employee Summary (list endpoint)
export interface EmployeeAvatar {
	id: string
	path: string
}

export interface EmployeeSummary {
	id: string
	firstName: string
	lastName: string
	checkedIn: boolean
	email: string | null
	phone?: string | null
	role: string
	status: string
	accountStatus: string
	roomId?: string | null
	pinCode?: number | null
	avatarId?: string | null
	avatar?: EmployeeAvatar | null
}

// API Response Types - Employee Full (detail endpoint)
export interface Employee {
	id: string
	firstName: string
	lastName: string
	checkedIn: boolean
	email: string | null
	phone?: string | null
	role: string
	status: string
	accountStatus: string
	roomId?: string | null
	pinCode?: number | null
	avatarId?: string | null
	avatar?: EmployeeAvatar | null
	hireDate?: string | null
	streetAddress?: string | null
	city?: string | null
	state?: string | null
	zipCode?: string | null
}

export interface EmployeeCertification {
	id: number
	employeeId: string
	degree: string
	certification: string
}

export interface EmployeeMedicalInfo {
	id: number
	employeeId: string
	allergies: string[]
	medications: string
	doctorName: string
	doctorPhone: string
}

export interface EmployeeEmergencyContact {
	id: number
	employeeId: string
	name: string
	phone: string
	relationshipTo: string
	avatarId: string | null
}

export interface EmployeeScheduleWeek {
	mon: boolean
	tue: boolean
	wed: boolean
	thu: boolean
	fri: boolean
	sat: boolean
	sun: boolean
}

export interface EmployeeSchedule {
	id: string
	employeeId: string
	week: EmployeeScheduleWeek
}

export interface EmployeeFull extends Employee {
	certification: EmployeeCertification | null
	medicalInfo: EmployeeMedicalInfo | null
	emergencyContacts?: EmployeeEmergencyContact[]
	schedule: EmployeeSchedule | null
}

// API Response Types - Employee Document
export type DocumentStatus = "active" | "expiring_soon" | "expired" | "uploaded"

export interface EmployeeDocument {
	id: string
	employeeId: string
	name: string
	status: DocumentStatus
	expiryDate: string | null
	type: string
	note: string | null
	uploadedAt: string
	uploadedBy: string | null
}

// API Response Types - Paginated List
export interface GetEmployeesResult {
	items: EmployeeSummary[]
	total: number
	limit: number
	offset: number
}

// API Request Types - Update Employee
export interface UpdateEmployeeCertification {
	degree: string
	certification: string
}

export interface UpdateEmployeeMedicalInfo {
	allergies?: string[]
	medications?: string
	doctorName?: string
	doctorPhone?: string
}

export interface UpdateEmployeeEmergencyContact {
	id?: number
	name: string
	phone: string
	relationshipTo?: string
}

export interface UpdateEmployeeScheduleWeek {
	mon: boolean
	tue: boolean
	wed: boolean
	thu: boolean
	fri: boolean
	sat: boolean
	sun: boolean
}

export interface UpdateEmployeeSchedule {
	week: UpdateEmployeeScheduleWeek
}

export interface UpdateEmployeePayload {
	firstName?: string
	lastName?: string
	email?: string
	phone?: string
	birthday?: string
	notes?: string
	role?: string
	status?: string
	hireDate?: string
	streetAddress?: string
	city?: string
	state?: string
	zipCode?: string
	roomIds?: string[]
	avatarId?: string
	certification?: UpdateEmployeeCertification
	medicalInfo?: UpdateEmployeeMedicalInfo
	emergencyContacts?: UpdateEmployeeEmergencyContact[]
	schedule?: UpdateEmployeeSchedule
}

// UI Helper Types
export type PinVisibility = Record<string, boolean>

// Form Data Types - exported from schemas/addStaff.schema.ts
export type { AddStaffFormData } from "./schemas/addStaff.schema"

// Helper function to get full name
export function getEmployeeFullName(employee: EmployeeSummary | Employee): string {
	return `${employee.firstName} ${employee.lastName}`
}

// Helper function to get avatar URL
export function getEmployeeAvatarUrl(employee: EmployeeSummary | Employee): string | undefined {
	return employee.avatar?.path
}
