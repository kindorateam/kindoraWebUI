import { z } from "zod"

const US_PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/
const usPhoneSchema = z.string().refine((val) => !val || US_PHONE_REGEX.test(val), "Invalid phone format")

export const staffProfileSchema = z.object({
	// Personal Info
	firstName: z.string({ message: "First name is required" }).trim().min(1, "First name is required"),
	lastName: z.string({ message: "Last name is required" }).trim().min(1, "Last name is required"),
	email: z.string({ message: "Email is required" }).email("Invalid email address"),
	phone: usPhoneSchema.optional(),
	birthday: z.string().optional(),
	notes: z.string().optional(),
	streetAddress: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	enrollDate: z.string().optional(),

	// Certification
	degree: z.string().optional(),
	certification: z.string().optional(),

	// Role & Status
	role: z.string({ message: "Role is required" }).min(1, "Role is required"),
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
	doctorPhone: usPhoneSchema.optional(),

	// Emergency Contacts
	emergencyContacts: z.array(
		z.object({
			id: z.number().optional(),
			name: z.string().min(1, "Name is required"),
			phone: usPhoneSchema.pipe(z.string().min(1, "Phone is required")),
			relationshipTo: z.string().optional(),
		}),
	),

	// Avatar
	avatarFile: z.instanceof(File).optional().nullable(),
	avatarPreview: z.string().optional().nullable(),
})

export type StaffProfileFormData = z.infer<typeof staffProfileSchema>
