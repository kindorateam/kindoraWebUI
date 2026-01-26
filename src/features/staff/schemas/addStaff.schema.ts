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
})

export type AddStaffFormData = z.infer<typeof addStaffSchema>
