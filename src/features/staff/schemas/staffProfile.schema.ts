import { z } from "zod"

import type { TFunction } from "i18next"

const US_PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/
const usPhoneSchema = (t: TFunction) =>
	z.string().refine((val) => !val || US_PHONE_REGEX.test(val), t("staff.validation.invalidPhone"))

export const createStaffProfileSchema = (t: TFunction) =>
	z.object({
		// Personal Info
		firstName: z
			.string({ message: t("staff.validation.firstNameRequired") })
			.trim()
			.min(1, t("staff.validation.firstNameRequired")),
		lastName: z
			.string({ message: t("staff.validation.lastNameRequired") })
			.trim()
			.min(1, t("staff.validation.lastNameRequired")),
		email: z.string({ message: t("staff.validation.emailRequired") }).email(t("staff.validation.invalidEmail")),
		phone: usPhoneSchema(t).optional(),
		birthday: z.string().optional(),
		notes: z.string().optional(),
		streetAddress: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		zipCode: z.string().optional(),

		// Certification
		degree: z.string().optional(),
		certification: z.string().optional(),

		// Role & Status
		role: z.string({ message: t("staff.validation.roleRequired") }).min(1, t("staff.validation.roleRequired")),
		signUpStatus: z.string().optional(),
		assignedRooms: z.array(z.string()).optional(),
		hireDate: z.string().optional(),

		// Schedule
		schedule: z.object({
			mon: z.boolean(),
			tue: z.boolean(),
			wed: z.boolean(),
			thu: z.boolean(),
			fri: z.boolean(),
			sat: z.boolean(),
			sun: z.boolean(),
		}),

		// Medical Info
		allergies: z.array(z.string()).optional(),
		medications: z.string().optional(),
		doctorName: z.string().optional(),
		doctorPhone: usPhoneSchema(t).optional(),

		// Emergency Contacts
		emergencyContacts: z.array(
			z.object({
				id: z.number().optional(),
				name: z.string().min(1, t("staff.validation.nameRequired")),
				phone: usPhoneSchema(t).pipe(z.string().min(1, t("staff.validation.phoneRequired"))),
				relationshipTo: z.string().optional(),
			}),
		),

		// Avatar
		avatarFile: z.instanceof(File).optional().nullable(),
		avatarPreview: z.string().optional().nullable(),
	})

export type StaffProfileFormData = z.infer<ReturnType<typeof createStaffProfileSchema>>
