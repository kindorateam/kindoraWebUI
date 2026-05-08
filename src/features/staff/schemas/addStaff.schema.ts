import { z } from "zod"

import type { TFunction } from "i18next"

export const createAddStaffSchema = (t: TFunction) =>
	z.object({
		// Step 1: Basic Info
		firstName: z
			.string({ message: t("staff.validation.firstNameRequired") })
			.trim()
			.min(1, t("staff.validation.firstNameRequired")),
		lastName: z
			.string({ message: t("staff.validation.lastNameRequired") })
			.trim()
			.min(1, t("staff.validation.lastNameRequired")),
		role: z.string({ message: t("staff.validation.roleRequired") }).min(1, t("staff.validation.roleRequired")),
		email: z.string({ message: t("staff.validation.emailRequired") }).email(t("staff.validation.invalidEmail")),
		inviteToKindora: z.boolean(),
		avatarPreview: z.string().optional(),
		avatarFile: z.instanceof(File).optional(),

		// Step 2: Personal Info (all optional)
		phone: z.string().optional(),
		birthday: z.string().optional(),
		enrollDate: z.string().optional(),
		state: z.string().optional(),
		city: z.string().optional(),
		streetAddress: z.string().optional(),
		zipCode: z.string().optional(),
		notes: z.string().optional(),

		// Step 3: Certification (all optional)
		degree: z.string().optional(),
		certification: z.string().optional(),

		// Step 4: Kindora role & status (all optional)
		hireDate: z.string().optional(),
		assignedRooms: z.array(z.string()).optional(),
		permissions: z.array(z.string()).optional(),

		// Step 5: Schedule (all optional)
		workingDays: z.array(z.string()).optional(),

		// Step 6: Medical info (all optional)
		allergies: z.array(z.string()).optional(),
		medications: z.string().optional(),
		doctorName: z.string().optional(),
		doctorPhone: z.string().optional(),

		// Step 7: Emergency contact (all optional)
		emergencyContactName: z.string().optional(),
		emergencyContactPhone: z.string().optional(),
		emergencyContactRelationship: z.string().optional(),
	})

export type AddStaffFormData = z.infer<ReturnType<typeof createAddStaffSchema>>
