import { z } from "zod"

export const addStaffSchema = z.object({
	// Step 1: Basic Info
	firstName: z.string({ message: "First name is required" }).trim().min(1, "First name is required"),
	lastName: z.string({ message: "Last name is required" }).trim().min(1, "Last name is required"),
	role: z.string({ message: "Role is required" }).min(1, "Role is required"),
	email: z.string({ message: "Email is required" }).email("Invalid email address"),
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
})

export type AddStaffFormData = z.infer<typeof addStaffSchema>
