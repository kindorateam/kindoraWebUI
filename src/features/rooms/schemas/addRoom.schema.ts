import { z } from "zod"

export const addRoomSchema = z
	.object({
		name: z.string().min(1, "Room name is required"),
		capacity: z.number().int().min(1, "Capacity must be at least 1"),
		ratio: z.number().int().min(1, "Ratio must be at least 1"),
		minAge: z.number().int().min(0, "Min age is required").max(7),
		maxAge: z.number().int().min(0, "Max age is required").max(7),
		avatarFile: z.instanceof(File).optional(),
		avatarPreview: z.string().optional(),
		staffIds: z.array(z.string()),
		studentIds: z.array(z.string()),
	})
	.refine((data) => data.minAge <= data.maxAge, {
		message: "Min age cannot be greater than max age",
		path: ["minAge"],
	})

export type AddRoomFormData = z.infer<typeof addRoomSchema>
