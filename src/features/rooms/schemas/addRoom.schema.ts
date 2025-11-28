import { z } from "zod"

export const addRoomSchema = z.object({
	name: z.string().min(1, "Room name is required"),
	capacity: z.number().int().min(1, "Capacity must be at least 1"),
	ratio: z.number().int().min(1, "Ratio must be at least 1"),
	avatarFile: z.instanceof(File).optional(),
	avatarPreview: z.string().optional(),
	staffIds: z.array(z.string()).min(1, "At least one staff member is required"),
	studentIds: z.array(z.string()).min(1, "At least one student is required"),
})

export type AddRoomFormData = z.infer<typeof addRoomSchema>
