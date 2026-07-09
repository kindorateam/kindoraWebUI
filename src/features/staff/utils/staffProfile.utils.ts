import { DEFAULT_SCHEDULE } from "../constants"
import { getEmployeeAvatarUrl } from "../types"

import type { StaffProfileFormData } from "../schemas/staffProfile.schema"
import type { EmployeeFull, UpdateEmployeePayload } from "../types"

export function buildDefaultValues(): StaffProfileFormData {
	return {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		birthday: "",
		notes: "",
		streetAddress: "",
		city: "",
		state: "",
		zipCode: "",
		degree: "",
		certification: "",
		role: "",
		signUpStatus: "",
		assignedRooms: [],
		hireDate: "",
		schedule: { ...DEFAULT_SCHEDULE },
		allergies: [],
		medications: "",
		doctorName: "",
		doctorPhone: "",
		emergencyContacts: [{ name: "", phone: "", relationshipTo: "" }],
		avatarFile: null,
		avatarPreview: null,
	}
}

export function buildFormValuesFromEmployee(employee: EmployeeFull): StaffProfileFormData {
	const preview = employee.avatar ? (getEmployeeAvatarUrl(employee) ?? null) : null

	return {
		firstName: employee.firstName,
		lastName: employee.lastName,
		email: employee.email ?? "",
		phone: employee.phone ?? "",
		birthday: "",
		notes: "",
		streetAddress: employee.streetAddress ?? "",
		city: employee.city ?? "",
		state: employee.state ?? "",
		zipCode: employee.zipCode ?? "",
		degree: employee.certification?.degree ?? "",
		certification: employee.certification?.certification ?? "",
		role: employee.role ?? "",
		signUpStatus: employee.accountStatus ?? "",
		assignedRooms: employee.roomId ? [employee.roomId] : [],
		hireDate: employee.hireDate ?? "",
		schedule: employee.schedule?.week ?? { ...DEFAULT_SCHEDULE },
		allergies: employee.medicalInfo?.allergies ?? [],
		medications: employee.medicalInfo?.medications ?? "",
		doctorName: employee.medicalInfo?.doctorName ?? "",
		doctorPhone: employee.medicalInfo?.doctorPhone ?? "",
		emergencyContacts: employee.emergencyContacts?.length
			? employee.emergencyContacts.map((c) => ({
					id: c.id,
					name: c.name,
					phone: c.phone,
					relationshipTo: c.relationshipTo ?? "",
				}))
			: [{ name: "", phone: "", relationshipTo: "" }],
		avatarFile: null,
		avatarPreview: preview,
	}
}

export function buildPayloadFromFormData(data: StaffProfileFormData): UpdateEmployeePayload {
	return {
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phone: data.phone || undefined,
		birthday: data.birthday || undefined,
		notes: data.notes || undefined,
		role: data.role,
		hireDate: data.hireDate || undefined,
		roomIds: data.assignedRooms?.length ? data.assignedRooms : undefined,
		streetAddress: data.streetAddress || undefined,
		city: data.city || undefined,
		state: data.state || undefined,
		zipCode: data.zipCode || undefined,
		certification:
			data.degree || data.certification
				? { degree: data.degree ?? "", certification: data.certification ?? "" }
				: undefined,
		medicalInfo: {
			allergies: data.allergies,
			medications: data.medications || undefined,
			doctorName: data.doctorName || undefined,
			doctorPhone: data.doctorPhone || undefined,
		},
		emergencyContacts: data.emergencyContacts.map((c) => ({
			id: c.id,
			name: c.name,
			phone: c.phone,
			relationshipTo: c.relationshipTo || undefined,
		})),
		schedule: { week: data.schedule },
	}
}
